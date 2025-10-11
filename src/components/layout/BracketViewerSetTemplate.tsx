import {AbsoluteCenter, Avatar, Box, Group, HStack, Text} from "@chakra-ui/react"
import {useContext} from "react"
import BracketSet from "../../utilities/obf-bracket-manager/BracketSet"
import {BracketEventContext, BracketViewerConfigsContext} from "../../contexts/main"
import BracketEntrant from "../../utilities/obf-bracket-manager/BracketEntrant"

const BracketViewerSet = ({
   set,
   onMatchClick
}: {
    set: BracketSet
    onMatchClick?: (set: BracketSet) => void
}) => {
    const bracket = useContext(BracketEventContext)
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)

    const {
        setWidth,
        setHeight,
        sideWidth,
        lineWidth,
        margin,
        setPrimaryColor,
        setScoreColor,
        setIDColor,
        setTextColor,
        bracketStageBackgroundColor,
        lineColor
    } = bracketViewerConfigs
    const isRoot = bracket.winnersRoot?.setId === set.setId || bracket.losersRoot?.setId === set.setId || bracket.root?.setId === set.setId
    const nameCardHeight = setHeight/2
    const round1Sets = bracket.getSetsByRound(1, {type: set.type})
    const hasMixedSets =
        round1Sets.some((round1Set) => round1Set.isOnlyChild()) &&
        round1Sets.some((round1Set) => !round1Set.isOnlyChild())
    const offset = (hasMixedSets && set.isOnlyChild() && set.round === 1 && (nameCardHeight * 2) + (margin * 3)) || 0

    const horizontalLinkStyle = !isRoot ? {
        content: '""',
        position: 'absolute',
        top: `${nameCardHeight}px`,
        left: `${setWidth - sideWidth - margin}px`,
        width: `${(setWidth/2)}px`,
        height: `${lineWidth}px`,
        backgroundColor: lineColor,
        zIndex: -1,
    } : {}

    const verticalLinkStyle = {
        content: '""',
        position: 'absolute',
        display: "inline-block",
        height: `${(nameCardHeight + 2)/2}px`,
        left: `${setWidth + (setWidth/2) - sideWidth - margin - lineWidth}px`,
        top: set.isLeftChild() ? `${(nameCardHeight * 1.3)}px` : "",
        bottom: set.isRightChild() ? `20px` : "",
        transform: "translateY(-50%)",
        width: `${lineWidth}px`,
        backgroundColor: lineColor,
        zIndex: -1,
    }

    const entrantCard = ({
        entrant,
        winnerSet,
        isP1
    }: {
        entrant?: BracketEntrant
        winnerSet?: BracketSet
        isP1: boolean
    }) => {
        return (
            <HStack
                bg={bracketStageBackgroundColor}
                h={"50%"}
                w={"100%"}
                gap={2}>
                {
                    entrant &&
                    <Avatar.Root size={"xs"} shape="square">
                      <Avatar.Fallback name={entrant.entrantTag} />
                      {/* @ts-expect-error src is not a valid prop for Avatar.Image */}
                      <Avatar.Image src={entrant.other.image} />
                    </Avatar.Root>
                }
                <Text
                    color={setTextColor}
                    whiteSpace={"nowrap"}
                    maxW={`105px`}
                    flexGrow={1}
                    fontWeight={(isP1 ? set.entrant1Result === "win" && "bold" : set.entrant2Result === "win" && "bold") || "none"}>
                    { entrant && entrant.entrantTag }
                </Text>
                {
                    !entrant &&
                    <Text
                        flexGrow={1}
                        fontStyle={"italic"}
                        whiteSpace={"nowrap"}>
                       { set.type !== "winners" && winnerSet ? `Loser of ${winnerSet.setId}` : " "}
                    </Text>
                }
                <Box
                    px={4}
                    height={"100%"}
                    color={setScoreColor}
                    bg={setPrimaryColor}
                    fontWeight={"bold"}
                    position={"relative"}>
                    <AbsoluteCenter>
                        { isP1 ? set.entrant1Score : set.entrant2Score }
                    </AbsoluteCenter>
                </Box>
            </HStack>
        )
    }

    return (
        <Box
            transform={"translateY(0)"}
            transition={"all 0.2s"}
            _hover={{
                transform: `translateY(${set.isLeftChild() ? "-5px" : "5px"})`,
                cursor: "pointer",
            }}
            zIndex={set.round!}
            pos={"relative"}>
            <Group attached
                   onClick={() => onMatchClick && onMatchClick(set)}
                   h={`${setHeight}px`}
                   w={`${setWidth}px`}
                   bg={setPrimaryColor}
                   key={set.setId}
                   zIndex={set.round!}
                   mb={`${offset || sideWidth}px`}
                   mr={`${margin}px`}
                   display={"flex"}
                   position={"relative"}
                   border={`${lineWidth || 2}px solid`}
                   borderColor={"border.muted"}
                   rounded={'md'}
                   transform={"translateY(0)"}
                   transition={"all 0.2s"}
                   _hover={{
                       borderColor: lineColor,
                   }}
                   _before={!isRoot ? verticalLinkStyle : {}}
                   _after={horizontalLinkStyle}>

                <Box
                    fontWeight={"bold"}
                    px={4}
                    color={setIDColor}>
                    <Text w={"100%"} height={"100%"} pos={"relative"}>
                        <AbsoluteCenter>
                            { set.setId }
                        </AbsoluteCenter>
                    </Text>
                </Box>

                <Box
                    w={"100%"} height={"100%"}
                    overflow={"hidden"}>
                    {
                        entrantCard({
                            entrant: set.leftEntrant,
                            winnerSet: set.leftWinnerSet || set.leftSet,
                            isP1: true
                        })
                    }
                    {
                        entrantCard({
                            entrant: set.rightEntrant,
                            winnerSet: set.rightWinnerSet || set.rightSet,
                            isP1: false
                        })
                    }
                </Box>
            </Group>
        </Box>
    )
}

export default BracketViewerSet
