// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials"
// import { loginWithEmailAndPassword } from '../../utils/auth';

export default NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = await loginWithEmailAndPassword(credentials.email, credentials.password);
          return user;
        } catch (error) {
          throw new Error('Invalid credentials');
        }
      },
    }),
    // Add other providers if needed
  ],
  // Optional: Configure session callbacks, database, callbacks, etc.
});
