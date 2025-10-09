import {getStartggEntrants, getStartggEvent, getStartggSets} from "./server_modules/startgg.js"

export async function POST(request) {
    const {api, url} = await request.json()
    if (api === "start.gg") {
        const event = await getStartggEvent(url)
        const entrants = await getStartggEntrants(url)
        const sets = await getStartggSets(url)
        return Response.json({event, entrants, sets})
    }

    else if (api === "challonge.com") {
        // return Response.json(await getTournamentInfo(url.trim()))
    }

    else if (api === "mtch.gg") {
        // return Response.json(await getTournamentInfo(url.trim()))
    }

    else {
        return Response.json({ error : "UNSUPPORTED SITE" }, {
            status: 400,
            statusText: "UNSUPPORTED SITE",
        })
    }
}
