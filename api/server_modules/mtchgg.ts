import {OBFEvent} from "../../src/types/obf"

export const getMtchggEvent = async ({
    eventId,
}: {
    eventId: string
}) => {
    const request = await fetch(`https://mtch.gg/api/v1/events/get-event?eventId=${eventId}`)
    if (request.ok) {
        return await request.json() as unknown as OBFEvent
    } else return undefined
}
