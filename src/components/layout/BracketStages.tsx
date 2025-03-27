import {Box, SimpleGrid} from "@chakra-ui/react"
import BracketSet from "@/utilities/classes/obf/BracketSet.ts";

const BracketStages = (props: {
    bracketRoot: BracketSet
}) => {
    const { bracketRoot } = props
    const numberOfWinnersRounds = bracketRoot.round
    const type = bracketRoot.type && bracketRoot.type === "winners" ? "Winners" : "Losers"

    const generateRoundLabels = () => {
        const roundLabelArray = new Array(numberOfWinnersRounds).fill(<></>)
        return roundLabelArray
            .map((round, index) => {
                const label = () => {
                    switch (index + 1) {
                        case numberOfWinnersRounds:
                            return `${bracketRoot.parentSet ? `${type} ` : ""}Finals`
                        case numberOfWinnersRounds - 1:
                            return `${bracketRoot.parentSet ? `${type} ` : ""}Semi Finals`
                        case numberOfWinnersRounds - 2:
                            return `${bracketRoot.parentSet ? `${type} ` : ""}Quarter Finals`
                        default:
                            return `${bracketRoot.parentSet ? `${type} ` : ""}Round ${index + 1}`
                    }
                }

                if (!round) return <></>
                else return (
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        w={"250px"}
                        h='10'
                        bg='#ff6200'
                        borderRadius={7}>
                        <Box as={"span"} fontWeight={"bold"}>
                            {label()}
                        </Box>
                    </Box>
                )
            })
    }

    return (
        <SimpleGrid minChildWidth={"269px"} w={`${269 * numberOfWinnersRounds}px`} columns={numberOfWinnersRounds}>
            { generateRoundLabels() }
        </SimpleGrid>
    )
}

export default BracketStages
