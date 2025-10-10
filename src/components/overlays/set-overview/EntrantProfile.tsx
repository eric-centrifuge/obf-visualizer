import {Avatar, Badge, EmptyState, Flex, Group, Heading, Icon, Image, VStack} from "@chakra-ui/react"
import {useContext} from "react"
import {FaHeart, FaPersonCircleQuestion} from "react-icons/fa6"
import {FiHeart} from "react-icons/fi"
import {IEntrant, SetGameResult, SetStatus} from "../../../types/obf"
import {BracketSetContext, SetContext} from "../../../contexts/main"

const EntrantProfile = ({
    isP1,
    entrant
}: {
    isP1: boolean
    entrant: IEntrant | undefined
}) => {
    const bracketSet = useContext(BracketSetContext)

    const {
        numberToWin
    } = bracketSet

    const set = useContext(SetContext)

    const {
        status,
        entrant1Score: score1,
        entrant2Score: score2,
        entrant1Result,
        entrant2Result,
    } = set

    const setResult = isP1 ? entrant1Result : entrant2Result

    return (
        <>
            <VStack gap={5}>
                {
                    entrant &&
                    <>
                      <Avatar.Root
                          size={"full"}
                          boxSize={"175px"}
                          fontSize={"6xl"}
                          rounded={"full"}
                          border={"4px solid"}
                          borderColor={"border.emphasized"}>
                        <Avatar.Fallback name={entrant.entrantTag}/>
                        {/* @ts-expect-error src is not a valid prop for Avatar.Image */}
                        <Avatar.Image asChild>
                          <Image
                              src={entrant.other.image}
                              aspectRatio={4 / 4}
                          />
                        </Avatar.Image>
                      </Avatar.Root>

                      <Flex flexDir={"column"} alignItems={"center"}>
                        {
                            entrant && (
                                <Heading
                                    size={"2xl"}
                                    fontStyle={!entrant ? "italic" : "inherit"}>
                                    { entrant.entrantTag }
                                </Heading>
                            )
                        }
                        {
                            status === SetStatus.Completed && (
                                <Badge mt={5} variant={"solid"} colorPalette={setResult === SetGameResult.Win ? "green" : "red"}>
                                    { `${setResult}`.toUpperCase() }
                                </Badge>
                            )
                        }
                      </Flex>

                      <Group my={5} gap={5}>
                          {
                              new Array(numberToWin).fill(0).map((value, index) => {
                                  const score = isP1 ? score1 : score2
                                  const winningSet = value + index + 1 <= score
                                  return (
                                      <Icon
                                          boxSize={"40px"}
                                          color={set.status === SetStatus.Completed ? setResult === SetGameResult.Win ? "fg" : "fg.muted" : "fg"}>
                                          { winningSet ? <FaHeart /> : <FiHeart /> }
                                      </Icon>
                                  )
                              })
                          }
                      </Group>
                    </>
                }
                {
                    !entrant &&
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <FaPersonCircleQuestion/>
                        </EmptyState.Indicator>
                        <EmptyState.Title>Pending</EmptyState.Title>
                        <EmptyState.Description>
                          Waiting for
                            {
                                isP1 &&
                                <>
                                    { bracketSet.leftSet && ` Winner of ${bracketSet.leftSet!.setId}` }
                                    { bracketSet.leftWinnerSet && !bracketSet.leftSet && ` Loser of ${bracketSet.leftWinnerSet!.setId}` }
                                </>
                            }
                            {
                                !isP1 &&
                                <>
                                    { bracketSet.rightSet && !bracketSet.rightWinnerSet && ` Winner of ${bracketSet.rightSet!.setId}` }
                                    { bracketSet.rightWinnerSet && !bracketSet.rightSet && ` Loser of ${bracketSet.rightWinnerSet.setId}` }
                                </>
                            }
                        </EmptyState.Description>
                      </EmptyState.Content>
                    </EmptyState.Root>
                }
            </VStack>
        </>
    )
}

export default EntrantProfile
