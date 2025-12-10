import { Hono } from "hono";
import { getStatsHome } from "./stats.controller";

const statsRouter = new Hono();

statsRouter.get('/', getStatsHome);

export default statsRouter;