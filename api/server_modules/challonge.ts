import {IEntrant, IEvent, ISet} from "../../src/types/obf.ts";

async function getData(endpoint = "") {
    const response = await fetch(`${process.env.CHALLONGE_API}${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    })
    return await response.json()
}


export const getChallongeEventInfo = async (tournamentId: string) => {
    const params = new URLSearchParams()

    params.set("api_key", `${process.env.CHALLONGE_KEY}`)
    params.set("include_participants", "1")
    params.set("include_matches", "1")

    const eventData = await getData(`tournaments/${tournamentId}.json?${params.toString()}`) as unknown as any

    if (eventData.errors) return undefined
    else {
        const { tournament } = eventData
        return ({
            event: extractEventData(tournament),
            entrants: extractEntrantData(tournament),
            sets: extractSetData(tournament),
        })
    }
}

const extractEventData = (tournament: any) => {
    const {
        id,
        name,
        url: tournamentId,
        tournament_type: tournamentStructure,
        started_at: startTime,
        completed_at: endTime,
        state,
    } = tournament

    return ({
        name,
        state,
        numberEntrants: tournament.participants.length,
        originURL: `https://challonge.com/${tournamentId}`,
        tournamentStructure,
        date: startTime,
        game: tournament.game_name,
        phases: [],
        other: {
            startTime,
            endTime,
            id,
        }
    } as unknown as IEvent)
}

const extractEntrantData = (tournament: any) => {
    return tournament.participants
        .map((participant) => {
            const { participant: entrant } = participant
            const {
                id: entrantID,
                name: entrantTag,
                seed: initialSeed,
                final_rank: finalPlacement,
                attached_participatable_portrait_url: image,
            } = entrant

            return ({
                entrantID,
                entrantTag,
                initialSeed,
                finalPlacement,
                personalInformation: [
                    {
                        name: entrantTag,
                        country: "",
                        tag: entrantTag,
                        prefix: "",
                    }
                ],
                other: {
                    image: image || "null",
                }
            } as unknown as IEntrant)
        })
}

const extractSetData = (tournament: any) => {
    const { matches } =  tournament
    const winnersSets = matches.filter((data) => data.match.round > 0)
    const loserSets = matches.filter((data) => data.match.round < 0)
    const winnersFinals = winnersSets.pop()
    const reorderedMatches = [winnersSets, loserSets, winnersFinals].flat()

    return reorderedMatches
        .map((data, index) => {
            const { match: set } = data
            const {
                id: setID,
                state,
                player1_id: entrant1ID,
                player2_id: entrant2ID,
                scores_csv: scores,
                identifier: uuid,
                winner_id: winner,
                loser_id: loser,
                player1_prereq_match_id: entrant1PrevSetID,
                player2_prereq_match_id: entrant2PrevSetID,
                started_at: startTime,
                completed_at: endTime,
                round: roundID,
            } = set

            return ({
                setID: `${index + 1}`,
                state,
                entrant1ID,
                entrant2ID,
                entrant1Score: scores.split("-")[0],
                entrant2Score: scores.split("-")[1],
                entrant1PrevSetID,
                entrant2PrevSetID,
                roundID: `${roundID}`,
                other: {
                    id: setID,
                    startTime,
                    endTime,
                    winner,
                    loser,
                    uuid
                }
            } as unknown as ISet)
        })
}
