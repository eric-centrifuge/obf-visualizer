import '../server_modules/startgg'
import '../server_modules/challonge'

export async function POST (request) {
  if (request.body.bracket.search('start.gg') !== -1){
    const obf = await startgg.startGGBracket(request.body.bracket.trim())
    return Response.json(obf)
  } else if (request.body.bracket.search('challonge.com') !== -1) {
    const obf = await challonge.getTournamentInfo(request.body.bracket.trim())
    return Response.json(obf)
  } else {
    return Response.json({ error : "UNSUPPORTED SITE" })
  }
}
