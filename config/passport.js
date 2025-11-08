import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OAUTH_CALLBACK_URL,
  PUBLIC_BASE_URL,
} = process.env;

// Determine the correct callback URL for Google OAuth
const callbackURL =
  OAUTH_CALLBACK_URL || `${PUBLIC_BASE_URL}/auth/google/callback`;

// Simple registration log for debugging environment setup
console.log('[passport] registering GoogleStrategy…', {
  hasId: !!GOOGLE_CLIENT_ID,
  hasSecret: !!GOOGLE_CLIENT_SECRET,
  callbackURL,
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL,
      passReqToCallback: false,
    },
    async (_access, _refresh, profile, done) => {
      const email = profile.emails?.[0]?.value ?? 'unknown@example.com';
      const id = profile.id;
      const user = { id, email, role: 'PLAYER', provider: 'google' };
      return done(null, user);
    }
  )
);

// Serialize and deserialize for session compatibility
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
