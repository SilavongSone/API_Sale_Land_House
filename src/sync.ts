import sequelize from "./db";
import { initAllAssociations } from "./models";

async function syncDB() {
  try {
    if (!process.env.DB_URL) throw new Error("DB_URL is missing!");

    // Initialize associations
    initAllAssociations();

    // Sync tables
    await sequelize.sync({ alter: true });
    console.log("✅ All tables created/updated successfully!");
  } catch (err) {
    console.error("❌ Failed to sync tables:", err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

syncDB();
