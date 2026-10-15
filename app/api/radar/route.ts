import { connection } from "next/server";
import { getDataSource } from "@/lib/data";

/* GET /api/radar: tendências válidas hoje e a sazonalidade de saúde do mês atual e dos dois seguintes. */

export async function GET() {
  await connection();
  const fonte = getDataSource();
  const hoje = new Date();
  const [radar, sazonalidade] = await Promise.all([fonte.getRadar(hoje.toISOString().slice(0, 10)), fonte.getSazonalidade(hoje.getMonth() + 1)]);
  return Response.json({ radar, sazonalidade, consultadoEm: hoje.toISOString() });
}
