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
            other: entrant.other
        })),
        layout: tournamentData.event.tournamentStructure
    })

    const SetTemplate = (set: BracketSet) => {
        const isRoot = bracket.winnersRoot?.setId === set.setId || bracket.losersRoot?.setId === set.setId || bracket.root?.setId === set.setId
        const isSingleElim = bracket.layout.toLowerCase() === "single elimination"
        const nameCardHeight = 30
        const matchNumberWidth = 30
        const width = 150
        const textPadding = 15
        const characterLimit = 16
        const matchNumberBG = "#ff6200"
        const horizontalLinkStyle = !isRoot ? {
            content: '""',
            position: 'absolute',
            top: "50%",
            left: "50%",
            width: "100%",
            height: "2px",
            backgroundColor: "#FFF",
            zIndex: -1,
        } : {}
        const verticalLinkStyle = !isRoot && bracket.winnersRoot?.leftSet?.setId !== set.setId || isSingleElim ? {
            content: '""',
            position: 'absolute',
            top: set.isLeftChild() ? "50%" : "-48%",
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
                    borderTopLeftRadius={"7px"}
                    borderBottomLeftRadius={"7px"}>
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
                        pr={`${textPadding}px`}
                        pl={`${textPadding / 2}px`}
                        h={nameCardHeight}
                        w={width}
                        display={"flex"}
                        alignItems={"center"}
                        color={"#000"}
                        backgroundColor={baseColor}
                        borderTopRightRadius={"7px"}>
                        {set.leftEntrant && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>{set.leftEntrant.entrantTag.slice(0, characterLimit)}</Text>}
                        {set.leftWinnerSet && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>Loser of {set.leftWinnerSet.setId}</Text>}
                    </Box>
                    <Box
                        pr={`${textPadding}px`}
                        pl={`${textPadding / 2}px`}
                        h={nameCardHeight}
                        w={width}
                        display={"flex"}
                        alignItems={"center"}
                        color={"#000"}
                        backgroundColor={baseColor}
                        borderBottomRightRadius={"7px"}>
                        {set.rightEntrant && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>{set.rightEntrant.entrantTag.slice(0, characterLimit)}</Text>}
                        {set.rightWinnerSet && <Text whiteSpace={"nowrap"} pos={"relative"} zIndex={1}>Loser of {set.rightWinnerSet.setId}</Text>}
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
