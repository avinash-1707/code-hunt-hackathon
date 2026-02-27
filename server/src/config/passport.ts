import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import { env } from "./env.js";
import { findOrCreateGoogleOAuthUser } from "../modules/auth/auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done,
    ) => {
      try {
        const user = await findOrCreateGoogleOAuthUser(profile);
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export { passport };
