import {IEntrant} from "../../types/obf.ts"
import {AbsoluteCenter, Avatar, Box, HStack, Text} from "@chakra-ui/react"
import {useContext} from "react"
import {BracketViewerConfigsContext, SetContext, SetsContext} from "../../contexts/main.tsx"

const PlayerNameplate = ({
    entrant,
    isP1
}: {
    entrant?: IEntrant
    isP1: boolean
}) => {
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)
    const set = useContext(SetContext)
    const sets = useContext(SetsContext)
    const entrant1PrevSet = sets.find((matchedSet) => set.entrant1PrevSetID === matchedSet.setID)
    const entrant2PrevSet = sets.find((matchedSet) => set.entrant2PrevSetID === matchedSet.setID)
    const entrant1PrevSetID = set.entrant1PrevSetID !== "null" && `${entrant1PrevSet && parseInt(entrant1PrevSet.roundID) < Math.abs(parseInt(set.roundID)) ? "Winner" : "Loser"} of ${set.entrant1PrevSetID}`
    const entrant2PrevSetID = set.entrant2PrevSetID !== "null" && `${entrant2PrevSet && parseInt(entrant2PrevSet.roundID) < Math.abs(parseInt(set.roundID)) ? "Winner" : "Loser"} of ${set.entrant2PrevSetID}`

    const {
        setPrimaryColor,
        setScoreColor,
        setTextColor,
        bracketStageBackgroundColor,
    } = bracketViewerConfigs

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
                    {isP1 ? entrant1PrevSetID : entrant2PrevSetID}
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

export default PlayerNameplate
