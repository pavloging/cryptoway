import dotenv from "dotenv";
import axios from "axios";
import { ICoin } from "../config/types";
dotenv.config();

class CoinService {
    data: Array<ICoin>;
    constructor() {
        this.data = [];
    }

    getAllCoins() {
        return this.data;
    }

    getCoins(coins: string) {
        const array = coins.split(",");
        const result = array.map((el) =>
            this.data.find((item) => item.key === el)
        );
        return result;
    }

    getLimitCoins(limit: number) {
        const coins = this.data.filter(coin => coin.type === "coin")
        const result = coins.slice(0, limit);
        return result;
    }

    async getData() {
        if (!process.env.URL) throw new Error("Not found URL in .env");
        const response = await axios.get(process.env.URL);
        const data = response.data.data;
        this.data = data;
        return data;
    }
}

export default new CoinService();
