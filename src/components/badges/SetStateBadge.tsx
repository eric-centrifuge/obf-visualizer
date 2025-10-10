import {Badge} from "@chakra-ui/react";
import { FaFlagCheckered } from "react-icons/fa"
import { MdOutlineAccessTimeFilled } from "react-icons/md"
import { MdTimer } from "react-icons/md"

const SetStateBadge = ({
    state
}: {
    state: string
}) => {
    switch (state) {
        case "completed":
            return (
                <Badge p={1} colorPalette="green" variant="solid">
                    <FaFlagCheckered /> Complete
                </Badge>
            )
        case "pending":
            return (
                <Badge p={1} colorPalette="blue" variant="solid">
                    <MdOutlineAccessTimeFilled /> Pending
                </Badge>
            )
        case "started":
            return (
                <Badge p={1} colorPalette="yellow" variant="solid">
                    <MdTimer /> In Progress
                </Badge>
            )
        default:
            return (
                <></>
            )
    }
}

export default SetStateBadge
