import {Box, Flex} from "@chakra-ui/react"
import {useContext} from "react"
import BracketSet from "../../utilities/obf-bracket-manager/BracketSet"
import {BracketEventContext, BracketViewerConfigsContext} from "../../contexts/main"

const BracketViewerStages = ({
    bracketRoot,
    reset
}: {
    bracketRoot: BracketSet
    reset?: boolean
}) => {
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)
    const bracketEvent = useContext(BracketEventContext)
    const sets = bracketEvent.sets
    const type = bracketRoot.type && bracketRoot.type === "winners" ? "Winners" : "Losers"
    const numberOfRounds = sets
        .filter((set) => {
            if (type) return set.type === type.toLowerCase()
        })
        .filter((set) => set.round <= bracketRoot.round)
        .map((set) => set.round)
        .reduce((previousValue, currentValue) => previousValue > currentValue ? previousValue : currentValue)
    const baseColor = bracketViewerConfigs.setPrimaryColor
    const {
        setWidth,
        setHeight,
        margin,
        setIDColor
    } = bracketViewerConfigs

    const generateRoundLabels = () => {
        const roundLabelArray = new Array(numberOfRounds).fill(<></>)
        return roundLabelArray
            .map((round, index) => {
                const label = () => {
                    switch (index + 1) {
                        case numberOfRounds:
                            return type === "Winners" ? "Grand Finals" : "Losers Finals"
                        case numberOfRounds - 1:
                            return type === "Winners" ? `${type} Finals` : `${type} Semi Finals`
                        case numberOfRounds - 2:
                            return type === "Winners" ? `${type} Semi Finals` : `${type} Quarter Finals`
                        case numberOfRounds - 3:
                            return type === "Winners" ? `${type} Quarter Finals` : `${type} Round ${index + 1}`
                        default:
                            return `${type} Round ${index + 1}`
                    }
                }

                if (!round) return <></>
                else return (
                    <Box
                        key={index}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        mr={`${margin}px`}
                        maxW={`${setWidth}px`}
                        minW={`${setWidth}px`}
                        h={`${setHeight/2}`}
                        shadow={'sm'}
                        rounded={'md'}
                        color={setIDColor}
                        bg={baseColor}>
                        {label()}
                    </Box>
                )
            })
    }

    return (
        <Flex fontWeight={"bold"}>
            { generateRoundLabels() }
            {
                reset &&
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    mr={`${margin}px`}
                    maxW={`${setWidth}px`}
                    minW={`${setWidth}px`}
                    h={`${setHeight/2}`}
                    shadow={'sm'}
                    rounded={'md'}
                    color={setIDColor}
                    bg={baseColor}>
                  Grand Finals Reset
                </Box>
            }
        </Flex>
    )
}

export default BracketViewerStages
