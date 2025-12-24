import {AbsoluteCenter, Box, Group, VStack} from "@chakra-ui/react"
import {useContext} from "react"
import {BracketViewerConfigsContext, EntrantsContext, SetContext, SetsContext} from "../../contexts/main"
import {ISet} from "../../types/obf.ts"
import PlayerNameplate from "./PlayerNameplate.tsx"

const BracketViewerSet = ({
    set,
    isLosersRoot = false,
    setOnClick
}: {
    set: ISet
    isLosersRoot?: boolean
    setOnClick?: (set: ISet) => void
}) => {
    const entrants = useContext(EntrantsContext)
    const sets = useContext(SetsContext)
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)

    const {
        setWidth,
        setHeight,
        lineWidth,
        margin,
        setPrimaryColor,
        setIDColor,
        lineColor
    } = bracketViewerConfigs

    const setID = set.setID
    const leftEntrant = entrants.find((entrant) => entrant.entrantID === set.entrant1ID)
    const rightEntrant = entrants.find((entrant) => entrant.entrantID === set.entrant2ID)
    const nameCardHeight = setHeight/2
    const parentSet = sets.some((parent) => setID === parent.entrant1PrevSetID || setID === parent.entrant2PrevSetID)

    const horizontalLinkStyle = !isLosersRoot && parentSet ? {
        content: '""',
        position: 'absolute',
        top: `${nameCardHeight}px`,
        transform: `translateX(50%)`,
        width: `full`,
        height: `${lineWidth}px`,
        backgroundColor: lineColor,
        zIndex: -2,
    } : undefined

    return (
        <VStack
            justifyContent={"center"}
            transition={"all 0.2s"}
            pos={"relative"}>
            <Group
                attached
                zIndex={1}
                onClick={() => setOnClick && setOnClick(set)}
                h={`${setHeight}px`}
                w={`${setWidth}px`}
                bg={setPrimaryColor}
                key={setID}
                mb={5}
                mr={`${margin}px`}
                display={"flex"}
                position={"relative"}
                border={`${lineWidth || 2}px solid`}
                borderColor={"border.muted"}
                rounded={'md'}
                transform={"translateY(0)"}
                transition={"all 0.2s"}
                _hover={{borderColor: lineColor, cursor: "pointer"}}
                _after={horizontalLinkStyle}>
                <Box
                    fontWeight={"bold"}
                    px={4}
                    color={setIDColor}>
                    <Box w={"100%"} height={"100%"} pos={"relative"}>
                        <AbsoluteCenter>
                            { setID }
                        </AbsoluteCenter>
                    </Box>
                </Box>

                <SetContext value={set}>
                    <Box
                        w={"100%"}
                        height={"100%"}
                        overflow={"hidden"}>
                        {
                            leftEntrant ?
                                <PlayerNameplate
                                    entrant={leftEntrant}
                                    isP1={true}
                                /> : <PlayerNameplate isP1={true}/>
                        }
                        {
                            rightEntrant ?
                                <PlayerNameplate
                                    entrant={rightEntrant}
                                    isP1={false}
                                /> : <PlayerNameplate isP1={false}/>
                        }
                    </Box>
                </SetContext>
            </Group>
        </VStack>
    )
}

export default BracketViewerSet
