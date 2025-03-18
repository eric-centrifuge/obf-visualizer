import BracketEntrant from "./BracketEntrant";

export class BracketSet {
    setId: number | undefined = undefined
    uuid?: number | undefined = undefined
    leftEntrant: BracketEntrant | undefined
    rightEntrant: BracketEntrant | undefined
    leftEntrantResult?: "win" | "lose"
    rightEntrantResult?: "win" | "lose"
    score: number[] = [0, 0]
    winner: BracketEntrant | undefined = undefined
    leftSet: BracketSet | undefined
    rightSet: BracketSet | undefined
    parentSet
    leftWinnerSet: BracketSet | undefined
    rightWinnerSet: BracketSet | undefined
    loserSet: BracketSet | undefined
    round: number
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
        this.leftEntrant.setName(entrant.entrantTag)
    }

    setRightEntrant(entrant: BracketEntrant | undefined) {
        if (!entrant) return
        this.rightEntrant = entrant
        this.rightEntrant.setName(entrant.entrantTag)
    }

    setEntrant(entrant: BracketEntrant | undefined) {
        if (!entrant) return
        if (!this.leftEntrant) this.leftEntrant = entrant
        else if (!this.rightEntrant) this.rightEntrant = entrant
    }

    setParentSet(parent: BracketSet) { if (parent) this.parentSet = parent }
    setMetaData(data: {[key: string]: never}) { this.other = {...this.other, ...data} }

    updateScore(score: number, winner: BracketEntrant) {
        if (!this.leftEntrant && !this.rightEntrant) return
        if (winner.initialSeed === this.leftEntrant!.initialSeed) this.score[0] = score
        else this.score[1] = score
    }

    advanceWinner(winner: BracketEntrant) {
        if (!this.leftEntrant && !this.rightEntrant && !this.parentSet) return
        if (this.parentSet!.leftSet) if (this.isLeftChild() && !this.parentSet!.leftEntrant!.initialSeed) this.parentSet!.setLeftEntrant(winner)
        else if (this.parentSet!.rightSet) if (this.isRightChild() && !this.parentSet!.rightEntrant!.initialSeed) this.parentSet!.setRightEntrant(winner)
        this.winner = winner
    }
}

export default BracketSet
