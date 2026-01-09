import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Auth.js route handler (per agents.md Section 3)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



