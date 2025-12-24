import {For, Group, Text} from "@chakra-ui/react"
import {useContext} from "react"
import {ISet} from "../../types/obf.ts";
import {BracketViewerConfigsContext, EventContext} from "../../contexts/main.tsx"

const BracketViewerStages = ({
    sets
}: {
    sets: ISet[]
}) => {
    const event = useContext(EventContext)
    const hasLosers = event.tournamentStructure.toLowerCase() === "double elimination"
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)
    const {setWidth} = bracketViewerConfigs
    return (
        <Group
            pos={"sticky"}
            top={0}
            gap={5}
            zIndex={2}>
            <For each={
                Array.from(
                    new Set(
                        sets
                            .map((set) => parseInt(set.roundID))
                            .sort()
                            .filter((roundID) => roundID)
                    )
                )
            }>
                {
                    (round, index) => (
                        <Text
                            bg={"bg.subtle"}
                            textAlign={"center"}
                            w={`${setWidth}px`}
                            py={3}>
                            {hasLosers ? round > 0 ? "Winners" : "Losers" : ""} Round {index + 1}
                        </Text>
                    )
                }
            </For>
        </Group>
    )
}

export default BracketViewerStages
