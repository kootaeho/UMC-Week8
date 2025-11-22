import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { handleUserSignUp, handleStoreAdd, handleAddReview, handleAddMission, handleStartMission } from "./src/controllers/user.controller.js";
import { errorHandler } from "./src/middleware/error-handler.js";
import { swaggerUi, specs } from "./src/config/swagger.config.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/store/add", handleStoreAdd);
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);
app.post("/api/v1/stores/:storeId/missions", handleAddMission);
app.post("/api/v1/users/:userId/missions/:missionId/start", handleStartMission);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});