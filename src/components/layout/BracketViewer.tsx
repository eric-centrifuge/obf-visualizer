import {Box, Center, Heading, Text} from "@chakra-ui/react"
import BracketEvent from "../../utilities/classes/obf/BracketEvent"
import BracketEntrant from "../../utilities/classes/obf/BracketEntrant"
import {Sample} from "@/types/obf"
import BracketSet from "@/utilities/classes/obf/BracketSet.ts";

const BracketViewer = (props: {
    onMatchClick?: () => void
    tournamentData: Sample | {[key: string]: never}
}) => {
    const {tournamentData} = props
    const entrants = tournamentData.entrants
    const baseColor = "#FFF"
    const bracket = new BracketEvent({
        name: tournamentData.event.name,
        entrants: entrants.map((entrant) => new BracketEntrant({
            entrantID: entrant.entrantID,
            initialSeed: entrant.initialSeed,
            entrantTag: entrant.entrantTag,
            finalPlacement: entrant.finalPlacement,
            other: entrant.other
        })),
        layout: tournamentData.event.tournamentStructure,
        sets: tournamentData.sets
    })

    const SetTemplate = (set: BracketSet) => {
        const isRoot = bracket.winnersRoot?.setId === set.setId || bracket.losersRoot?.setId === set.setId || bracket.root?.setId === set.setId
        const isSingleElim = bracket.layout.toLowerCase() === "single elimination"
        const nameCardHeight = 30
        const matchNumberWidth = 30
        const borderRadius = 7
        const width = 175
        const characterLimit = 16
        const matchNumberBG = "#ff6200"
        const horizontalLinkStyle = !isRoot ? {
            content: '""',
            position: 'absolute',
            top: "48%",
            left: "50%",
            width: "100%",
            height: "2px",
            backgroundColor: "#FFF",
            zIndex: -1,
        } : {}
        const verticalLinkStyle = !isRoot && bracket.winnersRoot?.leftSet?.setId !== set.setId || isSingleElim ? {
            content: '""',
            position: 'absolute',
            top: set.isLeftChild() ? "50%" : "-50%",
            left: "150%",
            height: "100%",
            width: "2px",
            backgroundColor: "#FFF",
            zIndex: -1,
        } : {}

        return (
            <Box
                key={set.setId}
                zIndex={set.round!}
                mb={5}
                mr={5}
                display={"flex"}
                position={"relative"}
                _before={set.getSibling() ? verticalLinkStyle : {}}
                _after={horizontalLinkStyle}>
                <Box
                    fontWeight={"bold"}
                    w={`${matchNumberWidth}px`}
                    backgroundColor={matchNumberBG}
                    border={`2px solid ${baseColor}`}
                    borderTopLeftRadius={`${borderRadius}px`}
                    borderBottomLeftRadius={`${borderRadius}px`}>
                    <Box
                        h={"100%"}
                        w={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}>
                        {set.setId}
                    </Box>
                </Box>
                <Box display={"flex"} flexDir={"column"}>
                    <Box
                        h={nameCardHeight}
                        w={width}
                        display={"flex"}
                        alignItems={"center"}
                        color={"#000"}
                        backgroundColor={baseColor}
                        borderTopRightRadius={`${borderRadius}px`}>
                        {
                            set.leftEntrant &&
                            <Box display={"flex"} w={"100%"} h={"100%"}>
                              <Text
                                style={{textDecoration: set.entrant1Result === "lose" ? "line-through" : "none"}}
                                flexGrow={1}
                                whiteSpace={"nowrap"}
                                pos={"relative"}>
                                  {set.leftEntrant.entrantTag ? set.leftEntrant.entrantTag.slice(0, characterLimit) : `??? (Seed ${set.leftEntrant.initialSeed})`} {set.setId === bracket.winnersRoot!.setId && set.entrant1Result === "win" && `👑`}
                              </Text>
                              <Box
                                ml={"auto"}
                                backgroundColor={"#ff6200"}
                                px={2}
                                fontWeight={"bold"}
                                border={`2px solid ${baseColor}`}
                                borderBottom={`1px solid ${baseColor}`}
                                borderTopRightRadius={`${borderRadius}px`}>
                                  {set.entrant1Score}
                              </Box>
                            </Box>
                        }
                        {!set.leftEntrant && set.leftWinnerSet && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>Loser of {set.leftWinnerSet.setId}</Text>}
                    </Box>
                    <Box
                        h={nameCardHeight}
                        w={width}
                        display={"flex"}
                        alignItems={"center"}
                        color={"#000"}
                        backgroundColor={baseColor}
                        borderBottomRightRadius={`${borderRadius}px`}>
                        {
                            set.rightEntrant &&
                            <Box display={"flex"} w={"100%"} h={"100%"}>
                                <Text
                                  style={{textDecoration: set.entrant2Result === "lose" ? "line-through" : "none"}}
                                  flexGrow={1}
                                  whiteSpace={"nowrap"}
                                  pos={"relative"}>
                                    { set.rightEntrant.entrantTag ? set.rightEntrant.entrantTag.slice(0, characterLimit) : `??? (Seed ${set.rightEntrant.initialSeed})` } {set.setId === bracket.winnersRoot!.setId && set.entrant2Result === "win" && `👑`}
                                </Text>
                                <Box
                                  ml={"auto"}
                                  backgroundColor={"#ff6200"}
                                  px={2}
                                  fontWeight={"bold"}
                                  border={`2px solid ${baseColor}`}
                                  borderTop={`1px solid ${baseColor}`}
                                  borderBottomRightRadius={`${borderRadius}px`}>
                                    {set.entrant2Score}
                                </Box>
                            </Box>
                        }
                        {!set.rightEntrant && set.rightWinnerSet && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>Loser of {set.rightWinnerSet.setId}</Text>}
                    </Box>
                </Box>
            </Box>
        )
    }

    const RenderChildren = (set: BracketSet) => {
        const hasChildren = set.leftSet || set.rightSet
        const children = () => {
            return (
                <ul>
                    {set.leftSet && RenderChildren(set.leftSet)}
                    {set.rightSet && RenderChildren(set.rightSet)}
                </ul>
            )
        }

        return (
            <Box
                as={"li"}
                position={"relative"}
                display={"flex"}
                flexDir={"row-reverse"}>
                <Box
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"center"}>
                    {SetTemplate(set)}
                </Box>
                { hasChildren && children() }
            </Box>
        )
    }

    return (
        <>
            {
                bracket.layout.toLowerCase() !== "single elimination" &&
                bracket.layout.toLowerCase() !== "double elimination" &&
                <Center>
                  <Heading>
                    <Text display={"inline-block"} color={"#ff6200"}>{bracket.layout.toUpperCase()}</Text> brackets not supported.
                  </Heading>
                </Center>
            }
            {
            bracket.layout.toLowerCase() === "single elimination" &&
                  <>
                    <Heading py={5}>SINGLE ELIMINATION</Heading>
                    <Box as={"ul"} display={"flex"}>
                        {RenderChildren(bracket.winnersRoot!)}
                    </Box>
                  </>
            }
            {
                bracket.layout.toLowerCase() === "double elimination" &&
                <>
                    <Heading py={5}>WINNERS</Heading>
                    <Box as={"ul"} display={"flex"}>
                      <Box
                        as={"li"}
                        position={"relative"}
                        display={"flex"}
                        flexDir={"row-reverse"}>
                        <Box
                          display={"flex"}
                          flexDir={"column"}
                          justifyContent={"center"}>
                            {SetTemplate(bracket.winnersRoot!)}
                        </Box>
                        <Box as={"ul"} display={"flex"}>
                            {RenderChildren(bracket.winnersRoot!.leftSet!)}
                        </Box>
                      </Box>
                    </Box>

                    <Heading py={5}>LOSERS</Heading>
                    <Box as={"ul"} display={"flex"}>
                        {RenderChildren(bracket.winnersRoot!.rightSet!)}
                    </Box>
                </>
            }
        </>
    )
}

export default BracketViewer
