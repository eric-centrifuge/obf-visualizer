import {getStartggEntrants, getStartggEvent, getStartggSets} from "./server_modules/startgg.js"

export async function POST(request) {
    const {api, url} = await request.json()
    if (api === "start.gg") {
        const slug = url.split("https://start.gg/")[1]
        const event = await getStartggEvent(slug)
        const entrants = await getStartggEntrants(slug)
        const sets = await getStartggSets(slug)
        return Response.json({event, entrants, sets})
    }

    else if (api === "challonge.com") {
        // return Response.json(await getTournamentInfo(url.trim()))
    }

    else if (api === "mtch.gg") {
        const eventId = url.split("https://mtch.gg/events/")[1]
        const request = await fetch(`https://mtch.gg/api/v1/events/get-event?eventId=${eventId}`)
        if (request.ok) {
            const event = await request.json()
            return Response.json(event)
        }
    }

    else {
        return Response.json({ error : "UNSUPPORTED SITE" }, {
            status: 400,
            statusText: "UNSUPPORTED SITE",
        })
    }
}
