// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

function verify(_accessToken, _refreshToken, profile, done) {
  const user = {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName,
    role: 'PLAYER'
  };
  return done(null, user);
}

// Only builds the strategy when this function is called
export function configurePassport() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_CALLBACK_URL } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !OAUTH_CALLBACK_URL) {
    throw new Error(
      `Missing Google OAuth env vars:
       GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID || '(undefined)'}
       GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET ? '(set)' : '(undefined)'}
       OAUTH_CALLBACK_URL=${OAUTH_CALLBACK_URL || '(undefined)'}`
    );
  }

  passport.use(new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: OAUTH_CALLBACK_URL },
    verify
  ));
}

export default passport;
