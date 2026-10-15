export function validateSearchQuery(value) {
  if (typeof value !== "string") { const error=new Error("Missing search query"); error.statusCode=400; error.publicMessage="Enter a search query."; throw error; }
  const query=value.trim();
  if (query.length<2||query.length>120) { const error=new Error("Invalid search query length"); error.statusCode=400; error.publicMessage="Search terms must be between 2 and 120 characters."; throw error; }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(query)) { const error=new Error("Invalid control character"); error.statusCode=400; error.publicMessage="Search terms contain unsupported characters."; throw error; }
  return query;
}
export function validateInviteCode(value) {
  if (typeof value!=="string"||! /^[A-Za-z0-9-]{2,64}$/.test(value)) { const error=new Error("Invalid invite code"); error.statusCode=400; error.publicMessage="That Discord invite code format is not valid."; throw error; }
  return value;
}
