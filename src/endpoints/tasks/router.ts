import { Hono } from "hono";
import { fromHono } from "chanfana";
import { GameEndpoint } from "../../services/game";

export const gameRouter = fromHono(new Hono());

gameRouter.post("/", GameEndpoint);
