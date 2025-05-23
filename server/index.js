import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";

/* CONFIGURATIONS */
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

console.log("Mongo URL:", process.env.MONGO_URL);
console.log("Environment:", process.env.NODE_ENV);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/kpi", kpiRoutes);
app.use("/api/product", productRoutes);
app.use("/api/transaction", transactionRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || 'localhost';
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT,HOST, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME ONLY OR AS NEEDED */
    //await mongoose.connection.db.dropDatabase();
    //await KPI.insertMany(kpis);
    //Product.insertMany(products);
    //Transaction.insertMany(transactions);
  })
  .catch((error) => console.log(`${error} did not connect`));