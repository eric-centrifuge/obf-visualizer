import {startGGBracket} from "./server_modules/startgg.js"
import {getTournamentInfo} from "./server_modules/challonge.js"

export async function POST (request) {
  const body = await request.json()
  if (body.bracket.includes('start.gg')) {
    const obf = await startGGBracket(body.bracket.trim())
    return Response.json(obf)
  } else if (body.bracket.includes('challonge.com')) {
    const obf = await getTournamentInfo(body.bracket.trim())
    return Response.json(obf)
  } else {
    return Response.json({ error : "UNSUPPORTED SITE" })
  }
}
