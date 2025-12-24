import {ISet} from "../../../types/obf.ts"
import {BracketViewerConfigsContext} from "../../../contexts/main.tsx"
import {useContext} from "react"
import BracketViewerStages from "../BracketViewerStages.tsx"
import {For, HStack, VStack} from "@chakra-ui/react"
import BracketViewerSet from "../BracketViewerSet.tsx"

const RoundRobin = ({sets, setOnClick}: {
    sets: ISet[],
    setOnClick: (set: ISet | null) => void
}) => {
    const roundIDs = Array.from(
        new Set(
            sets
                .map((set) => parseInt(set.roundID))
                .sort()
                .filter((roundID) => roundID)
        )
    )
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)

    bracketViewerConfigs.margin = 12

    return (
        <>
            <BracketViewerStages sets={sets}/>
            <HStack>
                <For each={roundIDs}>
                    {
                        (roundID) => (
                            <VStack key={roundID} my={5}>
                                <For each={sets.filter((set) => set.roundID === `${roundID}`).sort((a, b) => parseInt(a.setID) - parseInt(b.setID))}>
                                    {(set) => (
                                        <BracketViewerSet
                                            set={set}
                                            setOnClick={(set) => set.entrant1ID && set.entrant2ID && setOnClick && setOnClick(set)}
                                        />
                                    )}
                                </For>
                            </VStack>
                        )
                    }
                </For>
            </HStack>
        </>
    )
}

export default RoundRobin
