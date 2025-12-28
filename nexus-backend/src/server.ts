import "dotenv/config";
import app from "./app";
import { sequelize } from "./config/database";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    await sequelize.sync(); // ⚠️ dev only
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
})();
