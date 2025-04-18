import BracketEntrant from "./BracketEntrant";

export class BracketSet {
    setId: number | undefined = undefined
    uuid?: number | string | undefined = undefined
    leftEntrant: BracketEntrant | undefined
    rightEntrant: BracketEntrant | undefined
    entrant1Result?: "win" | "lose"
    entrant2Result?: "win" | "lose"
    entrant1Score: number = 0
    entrant2Score: number = 0
    leftSet: BracketSet | undefined
    rightSet: BracketSet | undefined
    parentSet
    leftWinnerSet: BracketSet | undefined
    rightWinnerSet: BracketSet | undefined
    loserSet: BracketSet | undefined
    round: number
    status: "started" | "pending" | "completed"
    type: "winners" | "losers"
    other: { [key: string]: never }

    constructor(props: {
        setId: number
        uuid?: number
        leftSet?: BracketSet
        rightSet?: BracketSet
        leftPlayer?: BracketEntrant
        rightPlayer?: BracketEntrant
        parentSet?: BracketSet
        leftWinner?: BracketSet
        rightWinner?: BracketSet
        loserSet?: BracketSet
        round: number
        type?: "winners" | "losers"
        status?: "started" | "completed" | "pending"
        other?: { [key: string]: never }
    }) {
        const {
            setId,
            uuid,
            leftPlayer,
            rightPlayer,
            leftSet,
            rightSet,
            parentSet,
            leftWinner,
            rightWinner,
            loserSet,
            round,
            type,
            status,
            other
        } = props
        this.setId = setId
        this.uuid = uuid
        this.leftEntrant = leftPlayer
        this.rightEntrant = rightPlayer
        this.addLeftSet(leftSet)
        this.addRightSet(rightSet)
        this.leftWinnerSet = leftWinner
        this.rightWinnerSet = rightWinner
        this.loserSet = loserSet
        this.parentSet = parentSet
        this.round = round
        this.type = type ? type : "winners"
        this.status = status ? status : "pending"
        this.other = other!
    }

    isLeftChild(): boolean {
        if (!this.parentSet) return false
        if (this.parentSet.leftSet) return this.setId === this.parentSet.leftSet.setId
        return false
    }

    isRightChild(): boolean {
        if (!this.parentSet) return false
        if (this.parentSet.rightSet) return this.setId === this.parentSet.rightSet.setId
        return false
    }

    isOnlyChild(): boolean {
        if (!this.parentSet) return false
        return this.parentSet.rightSet !== undefined
    }

    getSibling(): BracketSet | undefined {
        if (!this.parentSet) return undefined
        if (this.isLeftChild()) return this.parentSet.rightSet
        else if (this.isRightChild()) return this.parentSet.leftSet
        else return undefined
    }

    addSet(node: BracketSet | undefined) {
        if (!node) return
        if (!this.leftSet) this.addLeftSet(node)
        else this.addRightSet(node)
        node.setParentSet(this)
    }

    addLeftSet(set: BracketSet | undefined) {
        if (!set) return
        this.leftSet = set
        set.setParentSet(this)
    }

    addRightSet(set: BracketSet | undefined) {
        if (!set) return
        this.rightSet = set
        set.setParentSet(this)
    }

    setLosersSet(losersSet: BracketSet | undefined) {
        if (!losersSet) return
        if (!losersSet.leftWinnerSet && !losersSet.leftSet) losersSet.leftWinnerSet = this
        else if (!losersSet.rightWinnerSet && !losersSet.rightSet) losersSet.rightWinnerSet = this
        this.loserSet = losersSet
    }

    setLeftEntrant(entrant: BracketEntrant | undefined) {
        if (!entrant) return
        this.leftEntrant = entrant
    }

    setRightEntrant(entrant: BracketEntrant | undefined) {
        if (!entrant) return
        this.rightEntrant = entrant
    }

    setEntrant(entrant: BracketEntrant | undefined) {
        if (!entrant) return
        if (!this.leftEntrant) this.leftEntrant = entrant
        else if (!this.rightEntrant) this.rightEntrant = entrant
    }

    setParentSet(parent: BracketSet) { if (parent) this.parentSet = parent }
    setMetaData(data: {[key: string]: never}) { this.other = {...this.other, ...data} }

    updateScore(entrantId: string, score: number) {
        if (entrantId === `${this.leftEntrant!.entrantID}`) this.entrant1Score = score
        else if (entrantId === `${this.rightEntrant!.entrantID}`) this.entrant2Score = score
        else return
    }

    advanceWinner(entrant: "left" | "right") {
        if (entrant === "left") {
            this.entrant1Result = "win"
            this.entrant2Result = "lose"
            if (this.parentSet) this.parentSet.setEntrant(this.leftEntrant)
            if (this.loserSet) this.loserSet.setEntrant(this.rightEntrant)
        } else {
            this.entrant1Result = "lose"
            this.entrant2Result = "win"
            if (this.parentSet) this.parentSet.setEntrant(this.rightEntrant)
            if (this.loserSet) this.loserSet.setEntrant(this.leftEntrant)
        }
    }
}

export default BracketSet
