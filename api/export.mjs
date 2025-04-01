import {startGGBracket} from "./server_modules/startgg.js"
import {getTournamentInfo} from "./server_modules/challonge.js"

export async function POST (request) {
  if (request.body.bracket.search('start.gg') !== -1){
    const obf = await startGGBracket(request.body.bracket.trim())
    return Response.json(obf)
  } else if (request.body.bracket.search('challonge.com') !== -1) {
    const obf = await getTournamentInfo(request.body.bracket.trim())
    return Response.json(obf)
  } else {
    return Response.json({ error : "UNSUPPORTED SITE" })
  }
}
