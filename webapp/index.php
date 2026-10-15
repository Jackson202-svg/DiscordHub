<?php
declare(strict_types=1);

/**
 * DiscordHub admin-only webapp starter.
 *
 * Configure ADMIN_PASSWORD_HASH as a server environment variable using PHP's
 * password_hash() output. If it is missing, access stays disabled.
 * Deploy only over HTTPS and add your host's rate limiting before production.
 */
session_start();

$adminPasswordHash = getenv('ADMIN_PASSWORD_HASH') ?: '';
$setupMissing = $adminPasswordHash === '';
$error = '';

if (!isset($_SESSION['admin_csrf'])) {
    $_SESSION['admin_csrf'] = bin2hex(random_bytes(32));
}

if (isset($_POST['logout'])) {
    if (isset($_POST['csrf']) && hash_equals($_SESSION['admin_csrf'], (string) $_POST['csrf'])) {
        $_SESSION = [];
        session_destroy();
        header('Location: index.php');
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password']) && !$setupMissing) {
    $csrf = (string) ($_POST['csrf'] ?? '');
    if (!hash_equals($_SESSION['admin_csrf'], $csrf)) {
        $error = 'Your session expired. Refresh the page and try again.';
    } elseif (password_verify((string) $_POST['password'], $adminPasswordHash)) {
        session_regenerate_id(true);
        $_SESSION['discordhub_admin'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Invalid password.';
    }
}

$isAdmin = !empty($_SESSION['discordhub_admin']);
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
function e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DiscordHub Admin</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b1020; color: #f4f6ff; }
    main { width: min(92vw, 480px); padding: 28px; box-sizing: border-box; background: #151d32; border: 1px solid #2a3654; border-radius: 18px; }
    h1 { margin-top: 0; } p { color: #c1cbe0; line-height: 1.5; }
    label { display: block; margin: 18px 0 8px; } input[type=password] { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 9px; border: 1px solid #405071; background: #0b1020; color: white; }
    button { margin-top: 16px; padding: 11px 16px; border: 0; border-radius: 9px; background: #647bff; color: white; font-weight: 700; cursor: pointer; }
    .notice { padding: 12px; border-radius: 9px; background: #342a1b; color: #ffe0a3; }
    .error { color: #ffb4b4; } a { color: #b8c5ff; }
  </style>
</head>
<body>
<main>
  <h1>DiscordHub Admin</h1>
  <?php if ($setupMissing): ?>
    <p class="notice">Admin access is disabled until the server administrator configures the <code>ADMIN_PASSWORD_HASH</code> environment variable.</p>
    <p>Generate a password hash using PHP's <code>password_hash('your-long-password', PASSWORD_DEFAULT)</code> on a trusted machine, then set the resulting hash in your hosting environment. Do not put the password or hash in public source code.</p>
  <?php elseif ($isAdmin): ?>
    <p>Signed in to the starter admin area.</p>
    <p>This is a protected placeholder. Add admin features here only after reviewing authorization and audit requirements.</p>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= e($_SESSION['admin_csrf']) ?>">
      <button type="submit" name="logout" value="1">Sign out</button>
    </form>
  <?php else: ?>
    <p>Administrator sign-in is required to access this area.</p>
    <?php if ($error !== ''): ?><p class="error"><?= e($error) ?></p><?php endif; ?>
    <form method="post" autocomplete="off">
      <input type="hidden" name="csrf" value="<?= e($_SESSION['admin_csrf']) ?>">
      <label for="password">Admin password</label>
      <input id="password" name="password" type="password" required autocomplete="current-password">
      <button type="submit">Sign in</button>
    </form>
  <?php endif; ?>
</main>
</body>
</html>
