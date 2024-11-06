import express from "express";
import CoinsController from "../controllers/coins.controller";
const router = express.Router();

router.get("/status", CoinsController.status)
router.get('/coins/all', CoinsController.getAllCoins)
router.get('/coins=:coins', CoinsController.getCoins)
router.get("/limitCoins=:limit", CoinsController.getLimitCoins)


export default router