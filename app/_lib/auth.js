import NextAuth from "next-auth";
import Google from 'next-auth/providers/google'
import { createGuest, getGuest } from "@/app/_lib/data-service";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        authorized({ auth, request }) {
            return !!auth?.user;
        },
        async signIn({ user, account, profile }) {
            try {
                console.log('Sign-in attempt:', { email: user.email, name: user.name });
                const existingGuest = await getGuest(user.email);
                console.log('Existing guest:', existingGuest);

                if (!existingGuest) {
                    console.log('Creating new guest');
                    await createGuest({ email: user.email, full_name: user.name });
                }

                return true;
            } catch (error) {
                console.error('Sign-in error:', error);
                return false;
            }
        },
        async session({ session, user }) {
            try {
                const guest = await getGuest(session.user.email);
                session.user.guest_id = guest.id;
                return session;
            } catch (error) {
                console.error('Session error:', error);
                return session;
            }
        },
    },
    pages: {
        signIn: '/login',
        error: '/auth/error'
    },
    debug: true,
    trustHost: true
}

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(authConfig);