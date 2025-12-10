import { Context } from "hono"
import { statsService } from "./stats.service"

export async function getStatsHome(c: Context) {
    const category = await c.req.query("category");
    const getStats = await statsService.getStats();
    const topBooks = await statsService.getTopBooks({
        category: category ?? null,
        limit: 3
    })
    return c.json({ stats: getStats, topBooks })
}
