import {AbsoluteCenter, Box, Container, Dialog, EmptyState, Group, List, Portal, Separator} from "@chakra-ui/react"
import {useContext, useEffect, useState} from "react"
import {BracketViewerConfigsContext, EntrantsContext, EventContext, SetContext, SetsContext} from "../../contexts/main"
import {BiSolidHide} from "react-icons/bi"
import BracketViewerSet from "./BracketViewerSet.tsx"
import {ISet} from "../../types/obf.ts"
import {CloseButton} from "../ui/close-button"
import SetOverview from "../overlays/set-overview/SetOverview"
import BracketViewerStages from "./BracketViewerStages.tsx";


const BracketViewer = () => {
    const event = useContext(EventContext)
    const entrants = useContext(EntrantsContext)
    const sets = useContext(SetsContext)

    const roundIDs =
        Array.from(
            new Set(
                sets
                    .map((set) => set.roundID)
                    .filter((roundID) => roundID)
            )
        )

    const setsByRound =
        roundIDs
            .map((roundID) => sets.filter((set) => set.roundID === roundID))
            .map((sets, index, rounds) => {
                return sets.map((set) => {
                    if (!rounds[index + 1]) return set
                    rounds.forEach((round) => {
                        const entrant1Parent =
                            round.find((parent) => parent.entrant1PrevSetID === set.other.id)
                        const entrant2Parent =
                            round.find((parent) => parent.entrant2PrevSetID === set.other.id)
                        if (entrant1Parent) set.entrant1NextSetID = entrant1Parent.other.id
                        if (entrant2Parent) set.entrant2NextSetID = entrant2Parent.other.id
                    })
                    return set
                })
            })

    const winnerSets = setsByRound.flat().filter((set) => parseInt(set.roundID) > 0)
    const loserSets = setsByRound.flat().filter((set) => parseInt(set.roundID) < 0)
    const finals = winnerSets.slice(-2)[0]
    const losersFinals = loserSets.slice(-1)[0]
    const [currentSet, setCurrentSet] = useState(undefined as unknown as ISet)
    const [open, setOpen] = useState(false)
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
        setHeight,
        setWidth
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

    const RenderTree = ({
        root,
        nodes,
        isLosersRoot = false
    }: {
        root: ISet
        nodes: ISet[]
        isLosersRoot?: boolean
    }) => {
        const winnersSide = parseInt(root.roundID) > 0
        const hasChildren = !!root.entrant1PrevSetID || !!root.entrant2PrevSetID
        const leftSet = nodes.find((leftSet) => leftSet.other.id === root.entrant1PrevSetID)
        const rightSet = nodes.find((rightSet) => (
            rightSet.other.id === root.entrant2PrevSetID &&
            (winnersSide ? parseInt(rightSet.roundID) > 0 : parseInt(rightSet.roundID) < 0)
        ))

        return (
            <List.Item
                display={"flex"}
                flexDir={"row-reverse"}>
                <BracketViewerSet
                    set={root}
                    isLosersRoot={isLosersRoot}
                    onMatchClick={(set) => set && setCurrentSet(set)}
                />
                {
                    hasChildren &&
                    <List.Root zIndex={0}>
                        {
                            leftSet ?
                                <Box pos={"relative"} transform={parseInt(root.roundID) > 0 && leftSet && !rightSet ? `translateY(${setHeight - 32}px)` : undefined}>
                                    {RenderTree({root: leftSet, nodes, isLosersRoot: false})}
                                    {
                                        rightSet && (
                                            <Separator
                                                position={"absolute"}
                                                top={`-7px`}
                                                right={`24px`}
                                                transform={"auto"}
                                                translateY={`100%`}
                                                translateX={`${setWidth / 2}px`}
                                                borderColor={"border.emphasized"}
                                                size={"md"}
                                                orientation={"vertical"}
                                                h={"50%"}
                                            />
                                        )
                                    }
                                </Box> :
                                parseInt(root.roundID) > 0 && <Box
                                    w={"full"}
                                    h={`${setHeight}px`}
                                />
                        }
                        {
                            rightSet ?
                                <Box pos={"relative"} transform={parseInt(root.roundID) > 0 && rightSet && !leftSet ? `translateY(-${setHeight - 32}px)` : undefined}>
                                    {RenderTree({root: rightSet, nodes, isLosersRoot: false})}
                                    {
                                        leftSet && (
                                            <Separator
                                                position={"absolute"}
                                                bottom={`7px`}
                                                right={`24px`}
                                                transform={"auto"}
                                                translateY={`-100%`}
                                                translateX={`${setWidth / 2}px`}
                                                borderColor={"border.emphasized"}
                                                size={"md"}
                                                orientation={"vertical"}
                                                h={"50%"}
                                            />
                                        )
                                    }
                                </Box> :
                                parseInt(root.roundID) > 0 && <Box
                                    w={"full"}
                                    h={`${setHeight}px`}
                                />
                        }
                    </List.Root>
                }
            </List.Item>
        )
    }

    return (
        <SetContext value={currentSet}>
            <BracketViewerConfigsContext value={bracketViewerConfigs}>
                <Box h={"60vh"} overflow={"scroll"}>
                    <Box overflow={"visible"} pos={"relative"}>
                        {
                            event.tournamentStructure.toLowerCase() === "single elimination" &&
                            <>
                              <BracketViewerStages sets={winnerSets}/>
                              <List.Root display={"flex"} flexDirection={"row"}>
                                  {
                                      RenderTree({
                                          root: winnerSets.slice(-1)[0],
                                          nodes: winnerSets
                                      })
                                  }
                              </List.Root>
                            </>
                        }
                        {
                            event.tournamentStructure.toLowerCase() === "double elimination" &&
                            <>
                              <BracketViewerStages sets={winnerSets}/>
                              <Group
                                  attached
                                  display={"flex"}
                                  flexDirection={"row"}>
                                <List.Root>
                                    {
                                        RenderTree({
                                            root: finals,
                                            nodes: winnerSets,
                                        })
                                    }
                                </List.Root>
                                <BracketViewerSet
                                    set={winnerSets.slice(-1)[0]}
                                    onMatchClick={(set) => set.entrant1ID && set.entrant2ID && setCurrentSet(set)}
                                />
                              </Group>

                              <BracketViewerStages sets={loserSets}/>
                              <List.Root mt={5} display={"flex"} flexDirection={"row"}>
                                  {
                                      RenderTree({
                                          root: losersFinals,
                                          nodes: loserSets,
                                          isLosersRoot: true,
                                      })
                                  }
                              </List.Root>
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
    )
}

export default BracketViewer
