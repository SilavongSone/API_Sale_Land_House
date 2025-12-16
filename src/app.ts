import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db";
import { initAllAssociations } from "./models"; // Import the initializer

dotenv.config();

import userRoutes from "./routes/userRoutes";
import provinceRoutes from "./routes/provinceRoutes";
import districtRoutes from "./routes/districtRoutes";
import customerRoutes from "./routes/customerRoutes";
import currencyRoutes from "./routes/currencyRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import houseRoutes from "./routes/houseRoutes";
import landPlotRoutes from "./routes/landPlotRoutes";
// import maintenanceRoutes from "./routes/maintenanceRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import projectRoutes from "./routes/projectRoutes";
import saleRoutes from "./routes/saleRoutes";
import staffRoutes from "./routes/staffRoutes";
import zoneRoutes from "./routes/zoneRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", provinceRoutes);
app.use("/", districtRoutes);
app.use("/", customerRoutes);
app.use("/", currencyRoutes);
app.use("/", expenseRoutes);
app.use("/", houseRoutes);
app.use("/", landPlotRoutes);
// app.use("/", maintenanceRoutes);
app.use("/", paymentRoutes);
app.use("/", projectRoutes);
app.use("/", saleRoutes);
app.use("/", staffRoutes);
app.use("/", zoneRoutes);

// Initialize associations BEFORE syncing
initAllAssociations();



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


