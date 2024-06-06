// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import logger from "../../../../utils/logger";


const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailAddress: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailAddress: credentials.emailAddress,
            password: credentials.password,
          }),
        })
        logger.info('##################### we are in NextAuth')

        const user = await res.json();

        // logger.info('##################### we are in user --> ' , res.json());

        if (res.ok && user) {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error', // Ensure this page exists
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
