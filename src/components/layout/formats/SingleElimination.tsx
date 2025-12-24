import { List } from "@chakra-ui/react"
import {ISet} from "../../../types/obf.ts"
import BracketViewerStages from "../BracketViewerStages.tsx"
import RenderTree from "../RenderTree.tsx"

const SingleElimination = ({sets, setOnClick}: {
    sets: ISet[],
    setOnClick: (set: ISet | null) => void
}) => {
    return (
        <>
            <BracketViewerStages sets={sets}/>
            <List.Root display={"flex"} flexDirection={"row"}>
                <RenderTree
                    root={
                        sets
                            .sort((a,b) => parseInt(a.roundID) - parseInt(b.roundID))
                            .slice(-1)[0]
                    }
                    nodes={sets}
                    setOnClick={(set) => setOnClick && setOnClick(set)}
                />
            </List.Root>
        </>
    )
}

export default SingleElimination
