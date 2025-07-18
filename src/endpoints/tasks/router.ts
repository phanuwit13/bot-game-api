import { Hono } from "hono";
import { fromHono } from "chanfana";
import { taskList } from "../../services/tasks/taskList";
import { taskDetail } from "../../services/tasks/taskDetail";

export const tasksRouter = fromHono(new Hono());

tasksRouter.get("/", taskList);
tasksRouter.get("/:id", taskDetail);