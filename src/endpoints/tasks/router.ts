import { Hono } from "hono";
import { fromHono } from "chanfana";
import { game } from "../../services/game";

export const gameRouter = fromHono(new Hono());

gameRouter.post("/", game);
