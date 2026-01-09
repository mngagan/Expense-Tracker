import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Helper to get current user session
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// Helper to require authentication (redirects if not authenticated)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user?.id) {
    redirect("/api/auth/signin");
  }
  return user;
}

// Helper to get user ID (throws if not authenticated)
export async function getUserId(): Promise<string> {
  const user = await requireAuth();
  if (!user.id) {
    throw new Error("User ID not found in session");
  }
  return user.id;
}



