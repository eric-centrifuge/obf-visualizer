import {For, Group, Text} from "@chakra-ui/react"
import {useContext} from "react"
import {ISet} from "../../types/obf.ts";
import {BracketViewerConfigsContext} from "../../contexts/main.tsx"

const BracketViewerStages = ({
    sets
}: {
    sets: ISet[]
}) => {
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)

    const {
        setWidth
    } = bracketViewerConfigs

    return (
        <Group
            pos={"sticky"}
            top={0}
            mb={3}
            gap={5}
            zIndex={2}>
            <For each={
                Array.from(
                    new Set(
                        sets
                            .map((set) => parseInt(set.roundID))
                            .filter((roundID) => roundID)
                    )
                ).sort()
            }>
                {
                    (round, index) => (
                        <Text
                            bg={"bg.subtle"}
                            textAlign={"center"}
                            w={`${setWidth}px`}
                            py={3}>
                            {round > 0 ? "Winners" : "Losers"} Round {index + 1}
                        </Text>
                    )
                }
            </For>
        </Group>
    )
}

export default BracketViewerStages
