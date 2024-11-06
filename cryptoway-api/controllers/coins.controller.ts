import { Request, Response } from "express";
import CoinsService from "../service/coins.service";

class CoinsController {
    async status(req: Request, res: Response) {
        try {
            res.send(true).status(200);
        } catch (e: unknown) {
            console.error(e);
        }
    }
    async getAllCoins(req: Request, res: Response) {
        try {
            const coins = CoinsService.getAllCoins();
            res.send(coins).status(200)
        } catch (e: unknown) {
            console.error(e);
        }
    }
    async getCoins(req: Request, res: Response) {
        try {
            const coins = req.params.coins as string;
            if (!coins) res.send('Coins is not found');
            const coin = CoinsService.getCoins(coins);
            res.send(coin).status(200)
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getLimitCoins(req: Request, res: Response) {
        try {
            const limit = req.params.limit;
            if (!limit) res.send('Limit is not found')
            const coins = CoinsService.getLimitCoins(Number(limit))
            res.send(coins).status(200)
        } catch (e: unknown) {
            console.error(e)
        }
    }
}
export default new CoinsController();
