<?php
declare(strict_types=1);

/**
 * DiscordHub admin starter dashboard.
 * Access is disabled unless ADMIN_PASSWORD_HASH is set on the PHP server.
 */
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('discordhub_admin_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, max-age=0');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header("Content-Security-Policy: default-src 'self'; style-src 'self'; img-src 'self' data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

function e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function csrfToken(): string {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION['csrf_token'];
}
function validCsrf(): bool {
    return isset($_POST['csrf'], $_SESSION['csrf_token'])
        && is_string($_POST['csrf'])
        && hash_equals((string) $_SESSION['csrf_token'], $_POST['csrf']);
}

$adminPasswordHash = getenv('ADMIN_PASSWORD_HASH') ?: '';
$hashInfo = $adminPasswordHash !== '' ? password_get_info($adminPasswordHash) : ['algo' => null];
$setupMissing = $adminPasswordHash === '' || empty($hashInfo['algo']);
$error = '';
$notice = '';
$now = time();
$maxAttempts = 5;
$lockoutSeconds = 300;

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = [];
}
$_SESSION['login_attempts'] = array_values(array_filter(
    $_SESSION['login_attempts'],
    static fn ($attempt): bool => is_int($attempt) && $attempt > $now - $lockoutSeconds
));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validCsrf()) {
        $error = 'Your session token expired. Refresh the page and try again.';
    } elseif (isset($_POST['logout'])) {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => 'Strict',
            ]);
        }
        session_destroy();
        header('Location: index.php');
        exit;
    } elseif (isset($_POST['password']) && !$setupMissing) {
        if (count($_SESSION['login_attempts']) >= $maxAttempts) {
            $error = 'Too many sign-in attempts. Wait five minutes before trying again.';
        } elseif (is_string($_POST['password']) && password_verify($_POST['password'], $adminPasswordHash)) {
            session_regenerate_id(true);
            $_SESSION['discordhub_admin'] = true;
            $_SESSION['admin_signed_in_at'] = time();
            $_SESSION['login_attempts'] = [];
            unset($_SESSION['csrf_token']);
            csrfToken();
            header('Location: index.php');
            exit;
        } else {
            $_SESSION['login_attempts'][] = $now;
            $error = 'Sign-in failed. Check your password and try again.';
        }
    }
}

$idleTimeout = 30 * 60;
if (!empty($_SESSION['discordhub_admin'])) {
    $lastSeen = (int) ($_SESSION['admin_last_seen'] ?? $now);
    if ($now - $lastSeen > $idleTimeout) {
        $_SESSION = [];
        session_destroy();
        header('Location: index.php?expired=1');
        exit;
    }
    $_SESSION['admin_last_seen'] = $now;
}

$isAdmin = !empty($_SESSION['discordhub_admin']);
if (isset($_GET['expired'])) {
    $notice = 'You were signed out after 30 minutes of inactivity.';
}
if (isset($_GET['page']) && !is_string($_GET['page'])) {
    http_response_code(400);
    exit('Invalid page request.');
}
$page = (string) ($_GET['page'] ?? 'overview');
$allowedPages = ['overview', 'integrations', 'settings'];
if (!in_array($page, $allowedPages, true)) {
    http_response_code(404);
    $page = 'not-found';
}

$integrations = [
    'Google Search' => ['key' => 'GOOGLE_SEARCH_API_KEY', 'secondary' => 'GOOGLE_SEARCH_ENGINE_ID'],
    'Discord' => ['key' => 'DISCORD_BOT_TOKEN', 'secondary' => 'DISCORD_CLIENT_ID'],
    'GitHub' => ['key' => 'GITHUB_TOKEN', 'secondary' => null],
    'Database' => ['key' => 'DATABASE_URL', 'secondary' => null],
];
function configured(string $name): bool {
    $value = getenv($name);
    return is_string($value) && trim($value) !== '';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title><?= $isAdmin ? e(ucfirst($page) . ' · DiscordHub Admin') : 'DiscordHub Admin Sign-in' ?></title>
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<?php if ($setupMissing): ?>
  <main class="auth-wrap">
    <section class="auth-card">
      <div class="brand-mark">DH</div>
      <p class="eyebrow">ADMIN CONSOLE</p>
      <h1>DiscordHub</h1>
      <p class="muted">The admin console is locked until a valid password hash is configured on the PHP server.</p>
      <div class="notice warning"><strong>Setup required</strong><br>Set <code>ADMIN_PASSWORD_HASH</code> in your hosting environment. Do not add passwords or hashes to this repository.</div>
      <a class="text-link" href="README.md">Read the setup guide →</a>
    </section>
  </main>
<?php elseif (!$isAdmin): ?>
  <main class="auth-wrap">
    <section class="auth-card">
      <div class="brand-mark">DH</div>
      <p class="eyebrow">PRIVATE ADMIN AREA</p>
      <h1>Welcome back</h1>
      <p class="muted">Sign in to manage your DiscordHub project.</p>
      <?php if ($error !== ''): ?><div class="notice error" role="alert"><?= e($error) ?></div><?php endif; ?>
      <?php if ($notice !== ''): ?><div class="notice" role="status"><?= e($notice) ?></div><?php endif; ?>
      <form method="post" action="index.php" autocomplete="on">
        <input type="hidden" name="csrf" value="<?= e(csrfToken()) ?>">
        <label for="password">Administrator password</label>
        <input id="password" name="password" type="password" required maxlength="1024" autocomplete="current-password" autofocus>
        <button class="button primary full" type="submit">Sign in <span aria-hidden="true">→</span></button>
      </form>
      <p class="fine-print">Protected session · Automatic sign-out after 30 minutes idle</p>
    </section>
  </main>
<?php else: ?>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="index.php"><span class="brand-mark small">DH</span><span>DiscordHub<small>ADMIN CONSOLE</small></span></a>
      <nav aria-label="Admin navigation">
        <a class="<?= $page === 'overview' ? 'active' : '' ?>" href="index.php?page=overview"><span>▦</span> Overview</a>
        <a class="<?= $page === 'integrations' ? 'active' : '' ?>" href="index.php?page=integrations"><span>⌘</span> Integrations</a>
        <a class="<?= $page === 'settings' ? 'active' : '' ?>" href="index.php?page=settings"><span>⚙</span> Settings</a>
      </nav>
      <div class="sidebar-bottom"><span class="status-dot"></span> Admin session active</div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <div><p class="eyebrow">DISCORDHUB / ADMIN</p><h1><?= e($page === 'not-found' ? 'Page not found' : ucfirst($page)) ?></h1></div>
        <form method="post" action="index.php">
          <input type="hidden" name="csrf" value="<?= e(csrfToken()) ?>">
          <button class="button secondary" type="submit" name="logout" value="1">Sign out</button>
        </form>
      </header>
      <?php if ($notice !== ''): ?><div class="notice" role="status"><?= e($notice) ?></div><?php endif; ?>
      <?php if ($page === 'overview'): ?>
        <section class="welcome-panel">
          <div><p class="eyebrow">CONTROL CENTER</p><h2>Your project, at a glance.</h2><p class="muted">This starter dashboard confirms your admin session and checks which server-side integration settings are present.</p></div>
          <div class="hero-icon" aria-hidden="true">⌘</div>
        </section>
        <div class="stats-grid">
          <article class="stat-card"><span class="stat-label">Admin access</span><strong class="stat-value"><span class="status-dot"></span> Active</strong><span class="stat-note">Authenticated session</span></article>
          <article class="stat-card"><span class="stat-label">Configured integrations</span><strong class="stat-value"><?= count(array_filter($integrations, static fn ($item): bool => configured($item['key']) && (empty($item['secondary']) || configured($item['secondary'])))) ?> <small>/ <?= count($integrations) ?></small></strong><span class="stat-note">Environment variables only</span></article>
          <article class="stat-card"><span class="stat-label">Session timeout</span><strong class="stat-value">30 min</strong><span class="stat-note">Idle session expiry</span></article>
        </div>
        <section class="panel"><div class="panel-heading"><div><h2>Quick actions</h2><p class="muted">Manage the starter configuration.</p></div></div><div class="quick-grid">
          <a class="quick-card" href="index.php?page=integrations"><span class="quick-icon">⌘</span><strong>Check integrations</strong><span>See which API settings are configured.</span><b>Open integrations →</b></a>
          <a class="quick-card" href="index.php?page=settings"><span class="quick-icon">⚙</span><strong>Review security</strong><span>Read important deployment requirements.</span><b>Open settings →</b></a>
        </div></section>
      <?php elseif ($page === 'integrations'): ?>
        <section class="panel"><div class="panel-heading"><div><h2>Integration configuration</h2><p class="muted">Only whether a variable is present is displayed. Secret values are never shown.</p></div><span class="pill">Server-side</span></div>
          <div class="integration-list">
          <?php foreach ($integrations as $name => $item): $ready = configured($item['key']) && (empty($item['secondary']) || configured($item['secondary'])); ?>
            <article class="integration-row"><div class="integration-icon"><?= e(substr($name, 0, 1)) ?></div><div class="integration-copy"><strong><?= e($name) ?></strong><span><?= e($item['key']) ?><?= empty($item['secondary']) ? '' : ' + ' . e($item['secondary']) ?></span></div><span class="pill <?= $ready ? 'good' : 'pending' ?>"><?= $ready ? 'Configured' : 'Not configured' ?></span></article>
          <?php endforeach; ?>
          </div>
          <p class="muted helper-text">This check does not test whether the credentials are valid or whether the APIs are reachable.</p>
        </section>
      <?php elseif ($page === 'settings'): ?>
        <section class="panel"><div class="panel-heading"><div><h2>Security and deployment</h2><p class="muted">Recommended requirements for running this admin area.</p></div></div>
          <div class="settings-list">
            <div class="setting-row"><div><strong>HTTPS</strong><p>Use HTTPS in production so credentials and session cookies are protected in transit.</p></div><span class="pill <?= $isHttps ? 'good' : 'pending' ?>"><?= $isHttps ? 'Detected' : 'Not detected' ?></span></div>
            <div class="setting-row"><div><strong>Password storage</strong><p>Keep only a password hash in the server environment variable <code>ADMIN_PASSWORD_HASH</code>.</p></div><span class="pill good">Hash-based</span></div>
            <div class="setting-row"><div><strong>Login throttling</strong><p>This starter limits repeated failures within the current session. Add server/proxy-level rate limiting for production.</p></div><span class="pill pending">Add host limits</span></div>
            <div class="setting-row"><div><strong>PHP execution</strong><p>Deploy on a PHP-capable server. Static hosting such as GitHub Pages cannot execute PHP.</p></div><span class="pill">Required</span></div>
          </div>
        </section>
      <?php else: ?>
        <section class="panel"><h2>That page does not exist.</h2><a class="text-link" href="index.php">Return to overview →</a></section>
      <?php endif; ?>
      <footer class="footer">DiscordHub Admin <span>Starter dashboard · <?= date('Y') ?></span></footer>
    </main>
  </div>
<?php endif; ?>
</body>
</html>
