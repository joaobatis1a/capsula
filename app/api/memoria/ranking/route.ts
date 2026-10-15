import { connection } from "next/server";
import { getDataSource } from "@/lib/data";
import { rankear } from "@/lib/memoria/ranking";

/* GET /api/memoria/ranking: as 5 combinações que mais funcionaram e as 5 que mais falharam. */

export async function GET() {
  await connection();
  const fonte = getDataSource();
  const ranking = rankear(await fonte.getCampanhas(), { fonte: fonte.nome });
  return Response.json({ ...ranking, fonte: fonte.nome, origem: fonte.origem });
}
