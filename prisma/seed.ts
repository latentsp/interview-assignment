import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  // Create test user
  const user = await db.users.create({
    data: {
      id: "test-user-1",
      email: "candidate@example.com",
      name: "Test User",
      argyle_user_id: "019b41cf-9ab5-7a93-b6ef-263a6d29b82d",
    },
  });

  console.log("Created user:", user.id);

  // Create user token (Argyle connection)
  await db.user_tokens.create({
    data: {
      id: "test-token-1",
      user_id: user.id,
      provider: "ARGYLE",
      external_connection_id: "019b41cf-9ab5-7a93-b6ef-263a6d29b82d",
    },
  });

  console.log("Created user token");

  // Create income (employer)
  await db.incomes.create({
    data: {
      id: "test-income-1",
      user_id: user.id,
      name: "Acme Corp",
      source: "FORM_W2",
      provider_id: "ARGYLE",
      external_source_id: "argyle-item-123",
      external_account_id: "019b41d0-7a84-72db-beab-4f62f8e86ce4",
      status: "ACTIVE",
    },
  });

  console.log("Created income");
  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
