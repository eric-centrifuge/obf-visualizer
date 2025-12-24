import {AbsoluteCenter, Box, Container, Dialog, EmptyState, Portal} from "@chakra-ui/react"
import {useContext, useEffect, useState} from "react"
import {BracketViewerConfigsContext, EntrantsContext, EventContext, SetContext, SetsContext} from "../../contexts/main"
import {BiSolidHide} from "react-icons/bi"
import {ISet} from "../../types/obf.ts"
import {CloseButton} from "../ui/close-button"
import SetOverview from "../overlays/set-overview/SetOverview"
import SingleElimination from "./formats/SingleElimination.tsx"
import DoubleElimination from "./formats/DoubleElimination.tsx"
import RoundRobin from "./formats/RoundRobin.tsx"


const BracketViewer = () => {
    const event = useContext(EventContext)
    const entrants = useContext(EntrantsContext)
    const sets = useContext(SetsContext)
    const [currentSet, setCurrentSet] = useState<ISet|undefined>(undefined)
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

    useEffect(() => {
        setOpen(true)
    }, [currentSet])

    return (
        <SetContext value={sets.find((set) => currentSet && set.setID === currentSet.setID)!}>
            <BracketViewerConfigsContext value={bracketViewerConfigs}>
                {
                    entrants.length <= 2 && !sets.length && (
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
                }
                {
                    entrants.length > 2 && !!sets.length && (
                        <>
                            <Box h={"60vh"} overflow={"scroll"}>
                                <Box overflow={"visible"} pos={"relative"}>
                                    {
                                        event.tournamentStructure.toLowerCase() === "single elimination" &&
                                        <SingleElimination
                                            sets={sets}
                                            setOnClick={(set) => set && setCurrentSet(set)}
                                        />
                                    }
                                    {
                                        event.tournamentStructure.toLowerCase() === "double elimination" &&
                                        <DoubleElimination
                                            sets={sets}
                                            setOnClick={(set) => set && setCurrentSet(set)}
                                        />
                                    }
                                    {
                                        event.tournamentStructure.toLowerCase() === "round robin" &&
                                        <RoundRobin
                                            sets={sets}
                                            setOnClick={(set) => set && setCurrentSet(set)}
                                        />
                                    }
                                </Box>
                            </Box>
                            {
                                !!currentSet &&
                                <SetContext value={sets.find((set) => set.setID === currentSet.setID)!}>
                                  <Dialog.Root
                                      immediate={true}
                                      open={open}
                                      onOpenChange={(e: {open: boolean}) => setOpen(e.open)}
                                      onExitComplete={() => {
                                          setOpen(false)
                                          setCurrentSet(undefined)
                                      }}
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
                                          {/*@ts-expect-error TS2322: Type { children: Element; asChild: true; } is not assignable to type*/}
                                          <Dialog.CloseTrigger asChild>
                                            <CloseButton variant={"solid"} size={"lg"} />
                                          </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                      </Dialog.Positioner>
                                    </Portal>
                                  </Dialog.Root>
                                </SetContext>
                            }
                        </>
                    )
                }
            </BracketViewerConfigsContext>
        </SetContext>
    )
}

export default BracketViewer
