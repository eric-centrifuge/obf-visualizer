import {useContext} from "react"
import {BracketViewerConfigsContext} from "../../contexts/main.tsx"
import {Box, List, Separator} from "@chakra-ui/react"
import BracketViewerSet from "./BracketViewerSet.tsx"
import {ISet} from "../../types/obf.ts"

const RenderTree = ({
    root,
    nodes,
    isLosersRoot = false,
    setOnClick
}: {
    root: ISet
    nodes: ISet[]
    isLosersRoot?: boolean
    setOnClick?: (set: ISet) => void
}) => {
    const bracketViewerConfigs = useContext(BracketViewerConfigsContext)
    const winnersSide = parseInt(root.roundID) > 0
    const hasChildren = !!root.entrant1PrevSetID || !!root.entrant2PrevSetID
    const leftSet = nodes.find((leftSet) => leftSet.setID === root.entrant1PrevSetID)
    const rightSet = nodes.find((rightSet) => (
        rightSet.setID === root.entrant2PrevSetID &&
        (winnersSide ? parseInt(rightSet.roundID) > 0 : parseInt(rightSet.roundID) < 0)
    ))

    const {
        setHeight,
        setWidth
    } = bracketViewerConfigs

    return (
        <List.Item
            display={"flex"}
            flexDir={"row-reverse"}>
            <BracketViewerSet
                set={root}
                isLosersRoot={isLosersRoot}
                setOnClick={(set: ISet) => setOnClick && setOnClick(set)}
            />
            {
                hasChildren &&
                <List.Root zIndex={0}>
                    {
                        leftSet ?
                            <Box pos={"relative"} transform={winnersSide && leftSet && !rightSet ? `translateY(${setHeight - 32}px)` : undefined}>
                                {RenderTree({root: leftSet, nodes, isLosersRoot: false, setOnClick})}
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
                            winnersSide && <Box
                                w={"full"}
                                h={`${setHeight}px`}
                            />
                    }
                    {
                        rightSet ?
                            <Box pos={"relative"} transform={winnersSide && !leftSet && rightSet ? `translateY(-${setHeight - 32}px)` : undefined}>
                                {RenderTree({root: rightSet, nodes, isLosersRoot: false, setOnClick})}
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
                            winnersSide && (
                                <Box
                                    w={"full"}
                                    h={`${setHeight}px`}
                                />
                            )
                    }
                </List.Root>
            }
        </List.Item>
    )
}

export default RenderTree
