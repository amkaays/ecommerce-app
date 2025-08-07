// File: server/config/passport.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

export default function (passport) {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value
            };

            try {
                let user = await User.findOne({ where: { googleId: profile.id } });
                if (user) {
                    done(null, user);
                } else {
                    // Check if a user with this email already exists (e.g., registered manually)
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        // Link Google ID to the existing account
                        user.googleId = profile.id;
                        user.displayName = profile.displayName;
                        await user.save();
                        done(null, user);
                    } else {
                        // Create a new user
                        user = await User.create(newUser);
                        done(null, user);
                    }
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }));

    // Local Strategy (Email/Password)
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email: email.toLowerCase() } });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password.' });
            }
            if (!user.password) { // User registered with Google
                return done(null, false, { message: 'You have previously signed up with Google. Please use Google to log in.' });
            }

            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid email or password.' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    // Serialize and Deserialize User for session management
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}