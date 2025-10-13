import {getStartggEntrants, getStartggEvent, getStartggSets} from "./server_modules/startgg.js"
import {getChallongeEventInfo} from "./server_modules/challonge.js"
import {OBFEvent} from "../src/types/obf"

export async function POST(request) {
    const {api, url} = await request.json()

    if (api.includes("www.start.gg")) {
        const slug = url.split("https://www.start.gg/")[1].split("/brackets")[0]
        const event = await getStartggEvent(slug)
        const entrants = await getStartggEntrants(slug)
        const sets = await getStartggSets(slug)
        const obf = {event, entrants, sets} as unknown as OBFEvent
        obf.event.numberEntrants = entrants.length
        if (obf.event) return Response.json(obf)
        else return Response.json({ error : "Could not retrieve event information." }, {
            status: 400,
            statusText: "Could not retrieve event information.",
        })
    }

    else if (api.includes("challonge.com")) {
        const tournamentId = url.split("challonge.com/")[1]
        const obf = await getChallongeEventInfo(tournamentId) as unknown as OBFEvent
        if (obf) {
            const {event, entrants, sets} = obf
            return Response.json({event, entrants, sets})
        } else return Response.json({ error : "Could not retrieve event information." }, {
            status: 400,
            statusText: "Could not retrieve event information.",
        })
    }

    else if (api.mtch("mtch.gg")) {
        const eventId = url.split("https://mtch.gg/events/")[1]
        const request = await fetch(`https://mtch.gg/api/v1/events/get-event?eventId=${eventId}`)
        if (request.ok) {
            const obf = await request.json() as unknown as OBFEvent
            obf.event.originURL = `https://mtch.gg/events/${eventId}`
            return Response.json(obf)
        }
    }

    else {
        return Response.json({ error : "UNSUPPORTED SITE" }, {
            status: 400,
            statusText: "UNSUPPORTED SITE",
        })
    }
}
