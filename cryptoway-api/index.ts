import express from "express";
import router from "./router/index";
// import errorMiddleware from "./middlewares/error-middleware";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import dotenv from "dotenv";
import coinsService from "./service/coins.service";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use("/api", router);
// app.use(errorMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Loading data
setInterval(() => {coinsService.getData()}, 20000)
coinsService.getData()

app.listen(PORT, () => {
    console.log(`🚀 Server ready on port ${PORT}`);
});
