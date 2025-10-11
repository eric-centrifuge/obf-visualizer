import {ISet} from "../types/obf.ts";
import BracketSet from "./obf-bracket-manager/BracketSet.ts";
import {SetGameResult, SetStatus} from "./obf-bracket-manager/obf.ts";

export const startggRequest = async ({
    data
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: {[key: string]: any}
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

export const convertBracketSetToOBF = (set: BracketSet) => {
    const {
        entrant1Ready,
        entrant2Ready,
        entrant1Reported,
        entrant2Reported,
        entrant1Result,
        entrant2Result,
        entrant1Score,
        entrant2Score,
        status,
        leftEntrant,
        rightEntrant,
        other,
        setId,
        round,
        startTime,
        endTime,
        onStream,
        winner,
        loser,
        parentSet,
        loserSet,
        leftSet,
        rightSet,
        type,
        numberToWin: matchLimit
    } = set

    return ({
        setID: `${setId}`,
        status: status as SetStatus,
        phaseID: ``,
        roundID: `${type === "winners" ? round : -round}`,
        setFormat: ``,
        entrant1ID: leftEntrant ? leftEntrant.entrantID : `null`,
        entrant2ID: rightEntrant ? rightEntrant.entrantID : `null`,
        entrant1Result: `${entrant1Result}` as SetGameResult,
        entrant2Result: `${entrant2Result}` as SetGameResult,
        entrant1Score,
        entrant2Score,
        entrant1NextSetID: `null`,
        entrant2NextSetID: `null`,
        entrant1PrevSetID: leftSet ? `${leftSet.setId}` : `null`,
        entrant2PrevSetID: rightSet ? `${rightSet.setId}` : `null`,
        games: [],
        other: {
            ...other,
            entrant1Ready,
            entrant2Ready,
            entrant1Reported,
            entrant2Reported,
            startTime,
            endTime,
            onStream,
            winner,
            loser,
            matchLimit,
            nextWinnerSet: parentSet && parentSet.setId,
            nextLoserSet: loserSet && loserSet.setId,
            nextLeftWinnerSlot: set.isLeftChild() ? parentSet!.setId : `null`,
            nextRightWinnerSlot: set.isRightChild() && !parentSet!.rightEntrant ? parentSet!.setId : `null`,
            nextLeftLoserSlot: loserSet && loserSet.leftWinnerSet && loserSet.leftWinnerSet.setId === setId ? loserSet.setId : `null`,
            nextRightLoserSlot: loserSet && loserSet.rightWinnerSet && loserSet.rightWinnerSet.setId === setId ? loserSet.setId : `null`,
            leftSet: leftSet && leftSet.setId,
            rightSet: rightSet && rightSet.setId,
            label: `${setId}`,
        },
    })
}
