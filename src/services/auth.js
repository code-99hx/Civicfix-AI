/**
 * CivicFix AI Authentication Service Boundary
 * 
 * Provides production-ready OAuth integration hooks with Google Identity Services.
 * Requires VITE_GOOGLE_CLIENT_ID in your environment (.env) to authenticate against Google.
 */

export const getGoogleClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
};

export const isGoogleConfigured = () => {
  return Boolean(getGoogleClientId());
};

/**
 * Initiates the Google OAuth 2.0 flow.
 * In production with VITE_GOOGLE_CLIENT_ID, connects to Google Identity Services.
 * If credentials are not yet configured, returns an honest descriptive configuration notice.
 */
export async function signInWithGoogle() {
  const clientId = getGoogleClientId();

  if (!clientId) {
    // Return honest development error explaining required environment setup
    throw new Error(
      'Google OAuth 2.0 Client ID is not configured. Add VITE_GOOGLE_CLIENT_ID to your environment (.env) to enable live authentication with Google.'
    );
  }

  return new Promise((resolve, reject) => {
    // If Google Identity Services SDK is already present
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: (response) => {
            if (response.error) {
              reject(new Error(`Google authentication failed: ${response.error_description || response.error}`));
            } else {
              resolve(response);
            }
          },
          error_callback: (err) => {
            reject(new Error(`Google Sign-In prompt error: ${err.message || 'Window closed'}`));
          }
        });
        client.requestAccessToken();
      } catch (err) {
        reject(err);
      }
      return;
    }

    // Dynamically load Google Identity Services SDK if not already loaded
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        if (!window.google?.accounts?.oauth2) {
          reject(new Error('Google Identity Services failed to initialize.'));
          return;
        }
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: (response) => {
            if (response.error) {
              reject(new Error(`Google authentication failed: ${response.error_description || response.error}`));
            } else {
              resolve(response);
            }
          },
        });
        client.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services SDK. Check your network connection.'));
    };
    document.head.appendChild(script);
  });
}
