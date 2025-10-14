import {
    AbsoluteCenter,
    Box,
    Center,
    Container,
    Dialog,
    EmptyState,
    Heading,
    Portal,
    Text,
    VStack
} from "@chakra-ui/react"
import BracketEvent from "../../utilities/obf-bracket-manager/BracketEvent"
import BracketSet from "../../utilities/obf-bracket-manager/BracketSet"
import {useContext, useEffect, useState} from "react"
import {
    BracketEventContext,
    BracketViewerConfigsContext,
    EntrantsContext,
    EventContext,
    SetContext,
    SetsContext
} from "../../contexts/main"
import {BiSolidHide} from "react-icons/bi"
import BracketViewerSet from "./BracketViewerSetTemplate"
import BracketViewerStages from "./BracketViewerStages"
import {EventState, ISet} from "../../types/obf.ts"
import {CloseButton} from "../ui/close-button"
import SetOverview from "../overlays/set-overview/SetOverview"
import {convertBracketSetToOBF} from "../../utilities";

const BracketViewer = () => {
    const event = useContext(EventContext)
    const entrants = useContext(EntrantsContext)
    const sets = useContext(SetsContext)

    const bracket = new BracketEvent({
        entrants,
        sets,
        layout: event.tournamentStructure
    })

    const [currentSet, setCurrentSet] = useState(undefined as unknown as ISet)
    const [open, setOpen] = useState(false)
    const unsupported = bracket.layout.toLowerCase() !== "single elimination" && bracket.layout.toLowerCase() !== "double elimination"
    const bracketViewerConfigs = {
        setWidth: 220,
        setHeight: 65,
        sideWidth: 30,
        margin: 20,
        lineWidth: 2,
        lineColor: "border.emphasized",
        setTextColor: "fg",
        setBackgroundColor: "background",
        setIDColor: "var(--chakra-colors-highlight)",
        setScoreColor: "var(--chakra-colors-highlight)",
        bracketStageBackgroundColor: "var(--chakra-colors-bg-muted)",
        bracketStageTextColor: "chakra-body-text",
        setPrimaryColor: "var(--chakra-colors-bg)"
    }
    const {
        setWidth,
        margin,
        lineWidth,
        setHeight,
        lineColor,
    } = bracketViewerConfigs

    useEffect(() => {
        setOpen(true)
    }, [currentSet])

    if (entrants.length <= 2) return (
        <Container minH={"500px"} w={"full"}>
            <AbsoluteCenter>
                <EmptyState.Root textAlign={"center"} p={0}>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <BiSolidHide />
                        </EmptyState.Indicator>
                        <EmptyState.Title>
                            Bracket preview is unavailable.
                        </EmptyState.Title>
                    </EmptyState.Content>
                </EmptyState.Root>
            </AbsoluteCenter>
        </Container>
    )

    const RenderChildren = (set: BracketSet) => {
        const hasChildren = set.leftSet || set.rightSet
        const hasBothChildren = set.leftSet && set.rightSet
        const verticalLinkStyle = {
            content: '""',
            position: 'absolute',
            display: "inline-block",
            height: `calc(50% - ${setHeight/4}px)`,
            right: `-${(setWidth/2) - margin*3 - lineWidth*4}px`,
            top: `calc(50% - ${setHeight/4}px)`,
            transform: "translateY(-50%)",
            width: `${lineWidth || 2}px`,
            backgroundColor: lineColor,
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
                    <BracketViewerSet
                        set={set}
                        onMatchClick={(set) => {
                            if (!sets.length) return
                            setCurrentSet(convertBracketSetToOBF(set))
                        }}
                    />
                </Box>
                { hasChildren && children() }
            </Box>
        )
    }

    return (
        <BracketEventContext.Provider value={bracket}>
            <SetContext value={currentSet}>
                <BracketViewerConfigsContext value={bracketViewerConfigs}>
                    <Box h={"60vh"} overflow={"scroll"}>
                        <Box overflow={"visible"} pos={"relative"}>
                            {
                                unsupported &&
                                <Center>
                                  <Heading>
                                    <Text display={"inline-block"}>{bracket.layout}</Text> brackets not supported.
                                  </Heading>
                                </Center>
                            }
                            {
                                bracket.layout.toLowerCase() === "single elimination" &&
                                <>
                                  <Container maxW={"full"} px={0} mb={5} pos={"sticky"} top={`20px`} zIndex={10}>
                                    <BracketViewerStages bracketRoot={bracket.root!} />
                                  </Container>

                                  <Box as={"ul"} display={"flex"} pt={10}>
                                      { RenderChildren(bracket.root!) }
                                  </Box>
                                </>
                            }
                            {
                                bracket.layout.toLowerCase() === "double elimination" &&
                                <>
                                  <Container maxW={"full"} px={0} pos={"sticky"} top={`${margin}px`} mb={`${margin}px`} zIndex={20}>
                                    <BracketViewerStages bracketRoot={bracket.winnersRoot!} reset />
                                  </Container>

                                  <Box as={"ul"} display={"flex"} pt={5}>
                                    <Box
                                        as={"li"}
                                        position={"relative"}
                                        display={"flex"}
                                        flexDir={"row-reverse"}>
                                      <Box
                                          display={"flex"}
                                          flexDir={"column"}
                                          justifyContent={"center"}>
                                        <BracketViewerSet
                                            set={bracket.winnersRoot!}
                                            onMatchClick={
                                                (set) => {
                                                    if (!sets.length || event.state === EventState.Open) return
                                                    setCurrentSet(convertBracketSetToOBF(set))
                                                }
                                            }
                                        />
                                      </Box>
                                      <Box as={"ul"} display={"flex"}>
                                          { RenderChildren(bracket.winnersRoot!.leftSet!) }
                                      </Box>
                                    </Box>
                                    <VStack h={"100%"} justifyContent={"center"}>
                                        {
                                            <BracketViewerSet
                                                set={bracket.winnersRoot!.loserSet!}
                                                onMatchClick={
                                                    (set) => {
                                                        if (!sets.length) return
                                                        setCurrentSet(convertBracketSetToOBF(set))
                                                    }
                                                }
                                            />
                                        }
                                    </VStack>
                                  </Box>

                                  <Container maxW={"full"} px={0} mb={5} pos={"sticky"} top={`20px`} zIndex={20}>
                                    <BracketViewerStages bracketRoot={bracket.losersRoot!}/>
                                  </Container>

                                  <Box as={"ul"} display={"flex"}>
                                      {RenderChildren(bracket.losersRoot!)}
                                  </Box>
                                </>
                            }
                        </Box>
                    </Box>
                    {
                        !!currentSet &&
                        <SetContext value={currentSet}>
                          <Dialog.Root
                              immediate={true}
                              open={open}
                              onOpenChange={(e: {open: boolean}) => setOpen(e.open)}
                              onExitComplete={() => setOpen(false)}
                              size={"cover"}
                              placement={"center"}
                              closeOnInteractOutside={false}
                              scrollBehavior={"inside"}>
                            <Portal>
                              <Dialog.Backdrop />
                              <Dialog.Positioner>
                                <Dialog.Content>
                                  <Dialog.Body mb={5}>
                                    <SetOverview />
                                  </Dialog.Body>
                                    {/*@ts-expect-error ts(2322)*/}
                                  <Dialog.CloseTrigger asChild>
                                    <CloseButton variant={"solid"} size={"lg"} />
                                  </Dialog.CloseTrigger>
                                </Dialog.Content>
                              </Dialog.Positioner>
                            </Portal>
                          </Dialog.Root>
                        </SetContext>
                    }
                </BracketViewerConfigsContext>
            </SetContext>
        </BracketEventContext.Provider>
    )
}

export default BracketViewer
