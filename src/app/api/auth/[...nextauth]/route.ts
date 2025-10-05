// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // allow login even if status is pending (we will redirect client-side)
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No account found");
        if (!user.password) throw new Error("No credentials available");

        const ok = await bcrypt.compare(credentials!.password, user.password);
        if (!ok) throw new Error("Invalid credentials");

        // return a user object — include status so session contains it
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId?.toString() ?? null,
          status: user.status,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // signIn: attach DB info to `user` (so JWT will include these)
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        const email = (profile as any).email;
        let existing = await User.findOne({ email });

        if (!existing) {
          // create pending user without company
          existing = await User.create({
            email,
            name: (profile as any).name,
            companyId: null,
            role: "owner",
            status: "pending",
            verifyToken: null,
          });
        }

        // Attach DB data to the NextAuth `user` object so JWT/session carries it.
        (user as any).id = existing._id.toString();
        (user as any).role = existing.role;
        (user as any).companyId = existing.companyId?.toString() ?? null;
        (user as any).status = existing.status;
      }
      // For credentials provider we already returned user object in authorize
      return true; // important — let NextAuth finish and set token/cookie
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.role = (user as any).role ?? token.role;
        token.companyId = (user as any).companyId ?? token.companyId;
        token.status = (user as any).status ?? token.status;
        token.email = (user as any).email ?? token.email;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).user = (session as any).user || {};
      (session as any).user.id = token.id;
      (session as any).user.email = token.email;
      (session as any).user.role = token.role;
      (session as any).user.companyId = token.companyId;
      (session as any).user.status = token.status;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
