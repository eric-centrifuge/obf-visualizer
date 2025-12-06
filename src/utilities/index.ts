import {ISet} from "./obf-bracket-manager/lib/@types/obf"

export const startggRequest = async ({
    data
}: {
    data: any
}) => {
    const response = await fetch(`${process.env.STARTGG_API_ENDPOINT}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${process.env.STARTGG_TOKEN}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    })
    if (response.ok) return await response.json()
    else return null
}

export const generateRoundLabel = ({
   set,
   numberOfRounds
}: {
    set: ISet,
    numberOfRounds: number
}) => {
    const isWinners = +set.roundID > 0
    const type = isWinners ? "Winners" : "Losers"
    switch (Math.abs(+set.roundID)) {
        case numberOfRounds:
            return isWinners ? `Grand Finals Reset` : `${type} Finals`
        case numberOfRounds - 1:
            return isWinners ? `Grand Finals` : `${type} Semi Finals`
        case numberOfRounds - 2:
            return isWinners ? `${type} Finals` : `${type} Quarter Finals`
        case numberOfRounds - 3:
            return isWinners ? `${type} Semi Finals` : `${type} Round ${Math.abs(+set.roundID)}`
        case numberOfRounds - 4:
            return isWinners ? `${type} Quarter Finals` : `${type} Round ${Math.abs(+set.roundID)}`
        default:
            return `${type} Round ${Math.abs(+set.roundID)}`
    }
}
