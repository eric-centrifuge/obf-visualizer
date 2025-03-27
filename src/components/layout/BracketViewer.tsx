import {Box, Center, Container, Heading, Text} from "@chakra-ui/react"
import BracketEvent from "../../utilities/classes/obf/BracketEvent"
import BracketEntrant from "../../utilities/classes/obf/BracketEntrant"
import {Sample} from "@/types/obf"
import BracketSet from "@/utilities/classes/obf/BracketSet.ts";
import BracketStages from "@/components/layout/BracketStages.tsx";

const BracketViewer = (props: {
    onMatchClick?: (set: BracketSet) => void
    tournament: Sample | {[key: string]: never}
}) => {
    const { onMatchClick } = props
    const {tournament} = props
    const entrants = tournament.entrants
    const baseColor = "chakra-body-bg"
    const bracket = new BracketEvent({
        entrants: entrants.map((entrant) => new BracketEntrant({
            entrantID: entrant.entrantID,
            initialSeed: entrant.initialSeed,
            entrantTag: entrant.entrantTag,
            other: entrant.other,
            finalPlacement: entrant.finalPlacement || 0,
        })),
        sets: tournament.sets || [],
        layout: tournament.event.tournamentStructure || ""
    })

    const SetTemplate = (set: BracketSet) => {
        const isRoot = bracket.winnersRoot?.setId === set.setId || bracket.losersRoot?.setId === set.setId || bracket.root?.setId === set.setId
        const nameCardHeight = 30
        const nameCardBackgroundColor = "#FFF"
        const nameCardTextColor = "#000"
        const matchNumberWidth = 30
        const borderRadius = 7
        const width = 215
        const lineWidth = 2
        const margin = 20
        const highlightColor = "#ff6200"
        const round1Sets = bracket.getSetsByRound(1, {type: set.type})
        const mixedRound1Sets = round1Sets.some((round1Set) => !round1Set.getSibling()) && round1Sets.some((round1Set) => round1Set.getSibling())
        const offset = (mixedRound1Sets && !set.getSibling() && set.round < 2 && (nameCardHeight * 2) + (margin * 2)) || 0

        const horizontalLinkStyle = !isRoot ? {
            content: '""',
            position: 'absolute',
            top: `${nameCardHeight}px`,
            left: `${width + lineWidth}px`,
            width: `${(width/2)}px`,
            height: `${lineWidth}px`,
            backgroundColor: "#ff6200",
            zIndex: -1,
        } : {}

        const verticalLinkStyle = {
            content: '""',
            position: 'absolute',
            display: "inline-block",
            height: `${nameCardHeight/2}px`,
            left: `${(width * 1.5)}px`,
            top: set.isLeftChild() ? `${(nameCardHeight * 1.3)}px` : "",
            bottom: set.isRightChild() ? `22px` : "",
            transform: "translateY(-50%)",
            width: `${lineWidth}px`,
            backgroundColor: "#ff6200",
            zIndex: -1,
        }

        return (
            <Box
                onClick={() => onMatchClick && (tournament.event as unknown as {state: string}).state !== "complete" && onMatchClick(set)}
                key={set.setId}
                zIndex={set.round!}
                mb={`${offset || margin}px`}
                mr={`${margin}px`}
                display={"flex"}
                position={"relative"}
                border={`2px solid ${highlightColor}`}
                borderRadius={borderRadius}
                transform={"translateY(0)"}
                transition={"all 0.2s"}
                _hover={{
                    transform: `translateY(${set.isLeftChild() ? "-5px" : "5px"})`,
                    cursor: "pointer",
                }}
                _before={!isRoot ? verticalLinkStyle : {}}
                _after={horizontalLinkStyle}>
                <Box
                    fontWeight={"bold"}
                    w={`${matchNumberWidth}px`}
                    backgroundColor={highlightColor}>
                    <Box
                        h={"100%"}
                        w={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}>
                        {set.setId}
                    </Box>
                </Box>
                <Box
                    display={"flex"}
                    flexDir={"column"}
                    backgroundColor={baseColor}
                    borderRadius={borderRadius}
                    zIndex={3}>
                    <Box
                        h={nameCardHeight}
                        w={`${width}px`}
                        display={"flex"}
                        alignItems={"center"}
                        backgroundColor={baseColor}
                        borderTopRightRadius={borderRadius}>
                        {
                            set.leftEntrant &&
                            <Box
                                display={"flex"}
                                w={"100%"}
                                h={"100%"}
                                backgroundColor={nameCardBackgroundColor}>
                              <Text
                                  style={{fontWeight: set.entrant1Result === "win" ? "bold" : "none"}}
                                  flexGrow={1}
                                  px={2}
                                  color={nameCardTextColor}
                                  overflowX={"hidden"}
                                  whiteSpace={"nowrap"}
                                  pos={"relative"}>
                                  {set.leftEntrant.entrantTag ? set.leftEntrant.entrantTag : `??? (Seed ${set.leftEntrant.initialSeed})`}
                              </Text>
                              <Box
                                  ml={"auto"}
                                  backgroundColor={highlightColor}
                                  w={`${matchNumberWidth}px`}
                                  fontWeight={"bold"}>
                                  <Center>{set.entrant1Score}</Center>
                              </Box>
                            </Box>
                        }
                        {
                            !set.leftEntrant &&
                            set.leftWinnerSet &&
                            <Text
                                whiteSpace={"nowrap"}
                                pos={"relative"}
                                px={2}>
                              Loser of {set.leftWinnerSet.setId}
                            </Text>}
                    </Box>
                    <Box
                        h={nameCardHeight}
                        w={`${width}px`}
                        display={"flex"}
                        alignItems={"center"}
                        backgroundColor={baseColor}
                        borderBottomRightRadius={borderRadius}>
                        {
                            set.rightEntrant &&
                            <Box
                                display={"flex"}
                                w={"100%"}
                                h={"100%"}
                                backgroundColor={nameCardBackgroundColor}>
                              <Text
                                  style={{fontWeight: set.entrant2Result === "win" ? "bold" : "none"}}
                                  flexGrow={1}
                                  color={nameCardTextColor}
                                  overflowX={"hidden"}
                                  whiteSpace={"nowrap"}
                                  px={2}
                                  pos={"relative"}>
                                  { set.rightEntrant.entrantTag ? set.rightEntrant.entrantTag : `??? (Seed ${set.rightEntrant.initialSeed})` }
                              </Text>
                              <Box
                                  ml={"auto"}
                                  backgroundColor={"#ff6200"}
                                  w={`${matchNumberWidth}px`}
                                  fontWeight={"bold"}>
                                  <Center>{set.entrant2Score}</Center>
                              </Box>
                            </Box>
                        }
                        {
                            !set.rightEntrant &&
                            set.rightWinnerSet &&
                            <Text
                                whiteSpace={"nowrap"}
                                pos={"relative"}
                                px={2}>
                              Loser of {set.rightWinnerSet.setId}
                            </Text>}
                    </Box>
                </Box>
            </Box>
        )
    }

    const RenderChildren = (set: BracketSet) => {
        const hasChildren = set.leftSet || set.rightSet
        const hasBothChildren = set.leftSet && set.rightSet
        const lineWidth = 2
        const width = 215
        const margin = 20
        const verticalLinkStyle = {
            content: '""',
            position: 'absolute',
            display: "inline-block",
            height: `calc(50% - ${lineWidth}px + 1px)`,
            right: `-${(width/2) - margin - 30}px`,
            top: `calc(50% - ${margin/2}px)`,
            transform: "translateY(-50%)",
            width: `${lineWidth}px`,
            backgroundColor: "#ff6200",
        }
        const children = () => {
            return (
                <Box
                    as={"ul"}
                    pos={"relative"}
                    _after={hasBothChildren && verticalLinkStyle}>
                    {set.leftSet && RenderChildren(set.leftSet)}
                    {set.rightSet && RenderChildren(set.rightSet)}
                </Box>
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
        <Container
            maxW={"full"}
            pos={"relative"}
            overflow={"scroll"}
            w={"100%"}
            border={"5px solid"}
        >
            {
                bracket.layout.toLowerCase() !== "single elimination" &&
                bracket.layout.toLowerCase() !== "double elimination" &&
                <Center>
                  <Heading>
                    <Text display={"inline-block"}>{bracket.layout.toUpperCase()}</Text> brackets not
                    supported.
                  </Heading>
                </Center>
            }
            {
                bracket.layout.toLowerCase() === "single elimination" &&
                <>
                  <Container maxW={"full"} px={0} mb={10} pos={"sticky"} top={`20px`} zIndex={10}>
                    <BracketStages bracketRoot={bracket.root!}/>
                  </Container>

                  <Box as={"ul"} display={"flex"}>
                      {RenderChildren(bracket.root!)}
                  </Box>
                </>
            }
            {
                bracket.layout.toLowerCase() === "double elimination" &&
                <>
                  <Container maxW={"full"} px={0} mb={10} pos={"sticky"} top={`20px`} zIndex={20}>
                    <BracketStages bracketRoot={bracket.winnersRoot!}/>
                  </Container>

                  <Box as={"ul"} display={"flex"}>
                    <Box
                        as={"li"}
                        position={"relative"}
                        display={"flex"}
                        flexDir={"row-reverse"}>
                        {
                            bracket.reset &&
                            <Box
                                display={"flex"}
                                flexDir={"column"}
                                justifyContent={"center"}>
                                {SetTemplate(bracket.winnersRoot!.parentSet!)}
                            </Box>
                        }
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

                  <Container maxW={"full"} px={0} mb={5} pos={"sticky"} top={`20px`} zIndex={20}>
                    <BracketStages bracketRoot={bracket.losersRoot!}/>
                  </Container>

                  <Box as={"ul"} display={"flex"}>
                      {RenderChildren(bracket.winnersRoot!.rightSet!)}
                  </Box>
                </>
            }
        </Container>
    )
}

export default BracketViewer
