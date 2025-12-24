import {ISet} from "../../../types/obf.ts"
import BracketViewerStages from "../BracketViewerStages.tsx"
import {Group, List} from "@chakra-ui/react"
import RenderTree from "../RenderTree.tsx"
import BracketViewerSet from "../BracketViewerSet.tsx"

const DoubleElimination = ({sets, setOnClick}: {
    sets: ISet[],
    setOnClick: (set: ISet | null) => void
}) => {
    const roundIDs =
        Array.from(
            new Set(
                sets
                    .map((set) => set.roundID)
                    .filter((roundID) => roundID)
            )
        )

    const setsByRound =
        roundIDs
            .map((roundID) => sets.filter((set) => set.roundID === roundID))
            .map((sets, index, rounds) => {
                return sets.map((set) => {
                    if (!rounds[index + 1]) return set
                    rounds.forEach((round) => {
                        const entrant1Parent =
                            round.find((parent) => parent.entrant1PrevSetID === set.setID)
                        const entrant2Parent =
                            round.find((parent) => parent.entrant2PrevSetID === set.setID)
                        if (entrant1Parent) set.entrant1NextSetID = entrant1Parent.setID
                        if (entrant2Parent) set.entrant2NextSetID = entrant2Parent.setID
                    })
                    return set
                })
            })

    const winnerSets = setsByRound
        .flat()
        .filter((set) => parseInt(set.roundID) > 0)
        .sort((a, b) => parseInt(a.setID) - parseInt(b.setID))
    const loserSets = setsByRound
        .flat()
        .filter((set) => parseInt(set.roundID) < 0)
        .sort((a, b) => Math.abs(parseInt(a.setID)) - Math.abs(parseInt(b.setID)))
    const finals = winnerSets.slice(-2)[0]
    const losersFinals = loserSets.slice(-1)[0]
    return (
        <>
            <BracketViewerStages sets={winnerSets}/>
            <Group
                attached
                display={"flex"}
                flexDirection={"row"}>
                <List.Root>
                    <RenderTree
                        root={finals}
                        nodes={sets}
                        setOnClick={(set) => setOnClick(set)}
                    />
                </List.Root>
                <BracketViewerSet
                    set={winnerSets.slice(-1)[0]}
                    setOnClick={(set) => set.entrant1ID && set.entrant2ID && setOnClick(set)}
                />
            </Group>

            <BracketViewerStages sets={loserSets}/>
            <List.Root mt={5} display={"flex"} flexDirection={"row"}>
                <RenderTree
                    root={losersFinals}
                    nodes={loserSets}
                    isLosersRoot={true}
                    setOnClick={(set) => setOnClick(set)}
                />
            </List.Root>
        </>
    )
}

export default DoubleElimination
