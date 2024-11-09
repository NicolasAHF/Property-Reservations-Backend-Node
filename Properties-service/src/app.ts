import express from "express";
import { sequelize, dbSync } from "./config/database";
import propertyRoutes from "./routes/propertyRoutes";

const app = express();
const port = 3004;
const main = async () => {
  await dbSync();

  app.use(express.json());
  app.use("/api", propertyRoutes);

  app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    try {
      console.log(
        "La conexión con la base de datos ha sido establecida correctamente."
      );
    } catch (error) {
      console.error("No se pudo conectar a la base de datos:", error);
    }
  });
};

main();
