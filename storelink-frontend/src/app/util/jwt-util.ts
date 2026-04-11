export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
  } catch (e) {
    console.error('Invalid token format:', e);
    return true; // Treat malformed token as expired
  }
}
