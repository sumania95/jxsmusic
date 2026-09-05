import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/server/db";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name:string;
      is_uploader:boolean;
      is_admin:boolean;
      email:string;
      image:string;
      expireAt:Date;
      createdAt:Date;
      updatedAt:Date;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  // debug: true,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "online", // online is sufficient for standard scopes
          scope: "openid email profile" // ONLY use approved scopes
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) =>{
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const { email, password } = credentials as {
            email: string
            password: string
          }

          const user = await db.user.findUnique({
            where: { email },
          })

          if (!user?.password) throw new Error("Invalid email or password");


          const isValidPassword = await bcrypt.compare(
            password,
            user.password
          )

          if (!isValidPassword) throw new Error("Invalid email or password");

          return {
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            image: user.image,
            is_admin: user.is_admin,
            is_uploader: user.is_uploader,
            expireAt: user.expireAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
      }
    }),
    // DiscordProvider,
    /**
     * 
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  session:{
    strategy:'jwt',
  },
  pages:{
    signIn:"/auth/login",
    signOut:"/",
    newUser:'/'
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    // session: ({ session, user }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id,
    //   },
    // }),
    async session({ session,token }) {

      if(!token) return session;
      if (session.user) {
        // const ip = await axios.get(`${env.NEXTAUTH_URL}/api/ip-address`)
        console.log('trigger')
        const authUser = await db.user.findFirst({
          where:{
            email:String(token?.email)
          },
        })
        if (authUser) {
          session.user.id = authUser.id;
          session.user.email = String(authUser.email);
          session.user.name = String(authUser?.name);
          session.user.image = String(authUser?.image);
          session.user.expireAt = new Date(authUser?.expireAt);
          session.user.createdAt = new Date(authUser?.createdAt);
          session.user.updatedAt = new Date(authUser?.updatedAt);
          session.user.is_uploader = Boolean(authUser.is_uploader)
          session.user.is_admin = Boolean(authUser.is_admin)
          return session;
        }else{
          return session;
        }

      }else{
        console.log('error')

        return session;
      }
      
    },
  },
} satisfies NextAuthConfig;
