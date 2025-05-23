import db from "./dbConfig.js";

const testDBConnection = async () => {
  try {
    await db.raw("SELECT 1 AS test");
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    db.destroy(); // Close the connection
  }
};

testDBConnection();
