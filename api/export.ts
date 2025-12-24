import {getStartggEntrants, getStartggEvent, getStartggSets} from "./server_modules/startgg.js"
import {getChallongeEvent} from "./server_modules/challonge.js"
import {EventState, OBFEvent} from "../src/types/obf.js"
import {getMtchggEvent} from "./server_modules/mtchgg.js"

export async function POST(request: any) {
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
        const obf = await getChallongeEvent(tournamentId) as unknown as OBFEvent
        if (obf) {
            const {event, entrants, sets} = obf

            if (![EventState.Completed, EventState.Finalized].includes(event.state))
                return Response.json({
                    error: "This event is not complete yet. Please wait for the tournament to finish before trying to render the bracket."
                }, {
                    status: 400,
                    statusText: "This event is not complete yet. Please wait for the tournament to finish before trying to render the bracket.",
                })

            const modifiedSets = sets.map((set) => {
                const entrant1Set = sets.find((s) => s.other.id === set.entrant1PrevSetID)
                const entrant2Set = sets.find((s) => s.other.id === set.entrant2PrevSetID)
                set.entrant1PrevSetID = entrant1Set && entrant1Set.setID || set.entrant1PrevSetID
                set.entrant2PrevSetID = entrant2Set && entrant2Set.setID || set.entrant2PrevSetID
                return set
            })

            return Response.json({
                event,
                entrants,
                sets: modifiedSets
            })
        } else
            return Response.json({
                error : "Could not retrieve event information."
            }, {
                status: 400,
                statusText: "Could not retrieve event information.",
            })
    }

    else if (api.includes("mtch.gg")) {
        const eventId = url.split("mtch.gg/events/")[1]
        const obf = await getMtchggEvent({eventId})
        if (obf) {
            obf.event.originURL = `https://mtch.gg/events/${eventId}`
            obf.sets.forEach((set) => {
                set.other.id = set.setID
            })
            if (![EventState.Completed, EventState.Finalized].includes(obf.event.state))
                return Response.json({
                    error : "This event is not complete yet. Please wait for the tournament to finish before trying to render the bracket."
                }, {
                    status: 400,
                    statusText: "This event is not complete yet. Please wait for the tournament to finish before trying to render the bracket.",
                })
            return Response.json(obf)
        } else return Response.json({ error : "Could not retrieve event information." }, {
            status: 400,
            statusText: "Could not retrieve event information.",
        })
    }

    else {
        return Response.json({ error : "UNSUPPORTED SITE" }, {
            status: 400,
            statusText: "UNSUPPORTED SITE",
        })
    }
}
