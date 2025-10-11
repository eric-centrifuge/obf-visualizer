import {Breadcrumb, Center, GridItem, HStack, SimpleGrid} from "@chakra-ui/react"
import {useContext} from "react"
import {BracketEventContext, EntrantsContext, EventContext, SetContext} from "../../../contexts/main"
import {MdChevronRight} from "react-icons/md"
import EntrantProfile from "./EntrantProfile"
import {generateRoundLabel} from "../../../utilities"
import SetStateBadge from "../../badges/SetStateBadge"

const SetOverview = () => {
    const event = useContext(EventContext)
    const entrants = useContext(EntrantsContext)
    const bracket = useContext(BracketEventContext)
    const set = useContext(SetContext)
    const player1 = entrants.find((entrant) => entrant.entrantID === set.entrant1ID)
    const player2 = entrants.find((entrant) => entrant.entrantID === set.entrant2ID)
    const numberOfRounds = bracket.sets
        .filter((bracketSet) => bracketSet.type === (+set.roundID ? "winners" : "losers"))
        .map((set) => set.round)
        .reduce((previousValue, currentValue) => previousValue > currentValue ? previousValue : currentValue)

    return (
        <SimpleGrid columns={2} h={"100%"} gap={5}>
            <GridItem colSpan={{base: 2, md: 2}}>
                <Center>
                    <Breadcrumb.Root py={4}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                {
                                    generateRoundLabel({
                                        set,
                                        numberOfRounds: event.tournamentStructure.toLowerCase() === "single elimination" ? numberOfRounds + 1 : numberOfRounds
                                    })
                                }
                            </Breadcrumb.Item>
                            <MdChevronRight />
                            <Breadcrumb.Item>
                                { `Set ${set.setID}` }
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </Center>

                <Center>
                    <HStack>
                        <SetStateBadge state={set.status}/>
                    </HStack>
                </Center>
            </GridItem>

            <GridItem colSpan={{base: 2, md: 1}}>
                <EntrantProfile
                    entrant={player1}
                    isP1={true}
                />
            </GridItem>

            <GridItem colSpan={{base: 2, md: 1}}>
                <EntrantProfile
                    entrant={player2}
                    isP1={false}
                />
            </GridItem>
        </SimpleGrid>
    )
}

export default SetOverview
