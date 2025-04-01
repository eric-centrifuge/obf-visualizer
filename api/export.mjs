import {startGGBracket} from "./server_modules/startgg.js"
import {getTournamentInfo} from "./server_modules/challonge.js"

export async function POST (request) {
  console.log(request)
  if (request.body.bracket.includes('start.gg')) {
    const obf = await startGGBracket(request.body.bracket.trim())
    return Response.json(obf)
  } else if (request.body.bracket.includes('challonge.com')) {
    const obf = await getTournamentInfo(request.body.bracket.trim())
    return Response.json(obf)
  } else {
    return Response.json({ error : "UNSUPPORTED SITE" })
  }
}
