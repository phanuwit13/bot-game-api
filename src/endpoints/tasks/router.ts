import { Hono } from "hono";
import { fromHono } from "chanfana";
import { taskList } from "../../services/tasks/taskList";

export const tasksRouter = fromHono(new Hono());

tasksRouter.get("/", taskList);