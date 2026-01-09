import { z } from "zod";

// Environment variable schema (per agents.md Section 19)
const envSchema = z.object({
  POSTGRES_URL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

// Validate and export environment variables
// Only validates when accessed, not on module load
let cachedEnv: z.infer<typeof envSchema> | null = null;

function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse({
      POSTGRES_URL: process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    });
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
      const errorMessage = `Missing or invalid environment variables: ${missingVars}\n\n` +
        `Please create a .env.local file in the project root with:\n` +
        `POSTGRES_URL=your_postgres_url\n` +
        `POSTGRES_PRISMA_URL=your_prisma_url\n` +
        `NEXTAUTH_SECRET=your_secret (generate with: openssl rand -base64 32)\n` +
        `NEXTAUTH_URL=http://localhost:3000\n` +
        `GOOGLE_CLIENT_ID=your_google_client_id\n` +
        `GOOGLE_CLIENT_SECRET=your_google_client_secret\n\n` +
        `For local development, you can use placeholder values, but authentication and database features won't work.`;
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}

export const env = getEnv();

