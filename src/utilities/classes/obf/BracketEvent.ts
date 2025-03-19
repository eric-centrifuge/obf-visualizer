import BracketSet from "./BracketSet";
import BracketEntrant from "./BracketEntrant";
import {ISet} from "@/types/obf";

interface BracketMetaData {
    date?: string
    gameName?: string
}

class BracketEvent {
    name?: string
    numberOfEntrants = 3
    root
    winnersRoot?: BracketSet
    losersRoot?: BracketSet
    entrants?: Array<BracketEntrant>
    layout: string
    other: BracketMetaData = {
        date: new Date().toDateString(),
        gameName: "DNF Duel"
    }

    constructor(props: {
        name?: string
        sets?: ISet[]
        entrants: BracketEntrant[]
        layout: string
        metaData?: BracketMetaData
    }) {
        const {
            name,
            sets,
            entrants,
            layout,
            metaData
        } = props
        this.name = name || "Generic OBF Tournament"
        this.numberOfEntrants = entrants.length
        this.layout = layout
        this.entrants = entrants
        this.root = this.createBracket()
        this.winnersRoot = this.root
        if (metaData) this.addMetaData(metaData)
        this.assignEntrants()
        if (layout.toLowerCase() === 'double elimination') this.root = this.attachLosersBracket(this.root!)
        if (Array.isArray(sets)) this.mapSets(sets)
    }

    mapSets (sets: ISet[]) {
        if (!sets.length) return

        const advanceSets = (bracketSets: BracketSet[]) => {
            bracketSets.forEach((bracketSet) => {
                if (bracketSet.leftEntrant && bracketSet.rightEntrant) {
                    if (!bracketSet.leftEntrant!.finalPlacement) return
                    if (!bracketSet.rightEntrant!.finalPlacement) return

                    const setMatch = sets.find((set) => {
                       return `${set.entrant1ID}` === `${bracketSet.leftEntrant!.entrantID}` && `${set.entrant2ID}` === `${bracketSet.rightEntrant!.entrantID}`
                    })

                    if (setMatch) {
                        bracketSet.uuid = setMatch.setID
                        bracketSet.updateScore("left", setMatch.entrant1Score)
                        bracketSet.updateScore("right", setMatch.entrant2Score)
                        bracketSet.advanceWinner(setMatch.entrant1Score > setMatch.entrant2Score ? "left" : "right")
                    } else {
                        const setMatch = sets.find((set) => `${set.entrant2ID}` === `${bracketSet.leftEntrant!.entrantID}`)
                        if (setMatch) {
                            bracketSet.updateScore("left", setMatch.entrant2Score)
                            bracketSet.updateScore("right", setMatch.entrant1Score)
                            bracketSet.advanceWinner(bracketSet.entrant1Score > bracketSet.entrant2Score ? "left" : "right")
                        }
                    }
                }
            })
        }

        advanceSets(this.getAllWinnersSets())
        if (this.losersRoot) {
            advanceSets(this.getAllLosersSets())
            advanceSets([this.losersRoot!.leftSet!])
            advanceSets([this.losersRoot!])
            if (this.winnersRoot) advanceSets([this.winnersRoot!])
        }
    }

    assignEntrants () {
        if (!this.entrants) return
        const round1Sets = this.getSetsByRound(1, {type: "winners"})
        const round2Sets = this.getSetsByRound(2, {type: "winners"})
        const weavedAndPairedEntrants =
            this.weaveEntrants()
            .map((entrant, index, array) => !(index % 2) ? [entrant, array[index + 1]] : undefined)
            .filter((set) => set)
        const byes =
            weavedAndPairedEntrants
            .filter((set) => set && !set[1])
            .map((set) => set![0])

        round1Sets
            .forEach((set: BracketSet, index) => {
                const entrants = weavedAndPairedEntrants.filter((set) => set![1])
                set.setEntrant(entrants[index]![0])
                set.setEntrant(entrants[index]![1])
            })

        if (byes.length) {
            round2Sets
                .forEach((set) => {
                    if (set.leftSet && !set.leftEntrant && !set.rightSet) set.setEntrant(byes.shift())
                    else if (!set.leftEntrant && !set.rightSet) {
                        set.setEntrant(byes.shift())
                        set.setEntrant(byes.shift())
                    }
                })
        }
    }

    getEntrantById (id: string | number) {
        if (!this.entrants) return undefined
        const entrantIndex = this.entrants?.findIndex((entrant) => entrant.entrantID === id)
        return this.entrants![entrantIndex] || undefined
    }

    createBracket(size: number = this.numberOfEntrants) {
        if (size < 2) return

        let currentRound = 1
        let previousRoundSets = [] as unknown as BracketSet[]

        const winnersSets = []
        const numberOfRounds = this.calculateRounds(size)
        const byesFromRound1 = this.findHighestPowerOf2(size) - size
        const calculateNumberOfSets = (round: number) => {
            switch (round) {
                case 1:
                    return (size - byesFromRound1) / 2
                case 2:
                    return (byesFromRound1 + previousRoundSets.length) / 2
                default:
                    return previousRoundSets.length / 2
            }
        }

        while (currentRound <= numberOfRounds) {
            const lastIndex = previousRoundSets.length ? previousRoundSets.slice(-1)[0].setId : 0
            const currentRoundSets = []

            for (let index = 0; index < calculateNumberOfSets(currentRound); index++) {
                currentRoundSets.push(new BracketSet({
                    setId: index + 1 + (lastIndex || 0),
                    round: currentRound
                }))
            }

            if (previousRoundSets.length) {
                const weavedAndPairedEntrantIds =
                    this.weaveEntrants()
                        .map((entrant) => entrant && entrant.entrantID)
                        .map((entrant, index, array) => !(index % 2) ? [entrant, array[index + 1]] : undefined)
                        .filter((set) => set)
                        .map((entrant, index, array) => !(index % 2) ? [entrant, array[index + 1]] : undefined)
                        .filter((set) => set) as unknown as BracketEntrant[][]

                currentRoundSets
                    .forEach((set, index) => {
                        const siblings = weavedAndPairedEntrantIds[index] as unknown as BracketEntrant[][]
                        if (set.round! === 2) {
                            if (siblings[0][0] && siblings[0][1]) set.addSet(previousRoundSets.shift())
                            if (siblings[1][0] && siblings[1][1]) set.addSet(previousRoundSets.shift())
                        } else {
                            set.addSet(previousRoundSets.shift())
                            set.addSet(previousRoundSets.shift())
                        }
                    })
            }

            previousRoundSets = currentRoundSets
            winnersSets.push(...currentRoundSets)
            currentRound++
        }

        return winnersSets && winnersSets.slice(-1)![0]
    }

    orderSeeds () {
        const totalRounds = this.calculateRounds()
        const seedsByRound= []

        for (let i=0; i < totalRounds; i++) seedsByRound[i] = []

        seedsByRound[totalRounds] = [1,2]

        for (let currentRound = totalRounds; currentRound > 0; currentRound--) {
            const currentRoundSeeds = seedsByRound[currentRound]
            const previousRoundSeeds = seedsByRound[currentRound - 1]
            const numberOfSeedsInPreviousRound = currentRoundSeeds.length * 2

            if (previousRoundSeeds) {
                currentRoundSeeds
                    .forEach((seed: number, index: number) => {
                        previousRoundSeeds[index * 2] = seed
                        previousRoundSeeds[(index * 2) + 1] = numberOfSeedsInPreviousRound + 1 - seed
                    })
            }
        }

        return seedsByRound
    }

    weaveEntrants () {
        if (!this.entrants) return []
        return this.orderSeeds()[1]
            .map((seed) => this.entrants!.map((entrant) => entrant.initialSeed).includes(seed) ? seed : undefined)
            .map((seed) => seed !== undefined ? this.entrants!.find((entrant) => entrant.initialSeed === seed) : undefined)
    }

    attachLosersBracket (winnersFinals: BracketSet) {
        if (!winnersFinals) return winnersFinals

        const grandFinals = new BracketSet({
            setId: (winnersFinals.setId! * 2),
            type: "winners",
            round: winnersFinals.round! + 1
        })

        const grandFinalsReset = new BracketSet({
            setId: (winnersFinals.setId! * 2) + 1,
            type: "winners",
            round: winnersFinals.round! + 2
        })

        this.losersRoot = this.createLosersBracket(winnersFinals)
        this.winnersRoot = grandFinals

        if (this.numberOfEntrants > 2) {
            winnersFinals.setLosersSet(this.losersRoot)
            grandFinals.addLeftSet(winnersFinals)
            grandFinals.addRightSet(this.losersRoot)
            grandFinals.setLosersSet(grandFinalsReset)
            grandFinalsReset.addSet(grandFinals)
        } else {
            grandFinals.addLeftSet(winnersFinals)
            winnersFinals.setLosersSet(grandFinals)
            grandFinalsReset.addSet(grandFinals)
            grandFinals.setLosersSet(grandFinalsReset)
        }

        return grandFinalsReset
    }

    linkLosersSets (losersBracket: BracketSet[]) {
        const numberOfRounds = losersBracket[losersBracket.length - 1].round!
        const winnersRound1 = this.getSetsByRound(1, {type: "winners"})
        const winnersRound2 = this.getSetsByRound(2, {type: "winners"})
        let firstTimeLoserSets = this.getAllWinnersSets()
        let round = 1

        while (round <= numberOfRounds) {
            const currentRoundSets = losersBracket.filter((node) => node.round! === round)
            const nextRoundSets = losersBracket.filter((node) => node.round! === round + 1)

            switch (round) {
                case 1:
                    winnersRound1
                        .filter((set) => set.isLeftChild())
                        .forEach((round1Set, index) => {
                            const loserSet = currentRoundSets.find((set) => !set.parentSet)
                            const parentIndex = winnersRound2.findIndex((parentSet) => parentSet.setId === round1Set.parentSet!.setId)
                            const round2Set = winnersRound2.slice(0).reverse()[parentIndex]

                            if (winnersRound1.every((set) => set.getSibling())) {
                                round1Set.setLosersSet(currentRoundSets[index])
                                round1Set.getSibling()!.setLosersSet(currentRoundSets[index])
                                nextRoundSets[index].addSet(currentRoundSets[index])
                            } else if (winnersRound1.every((set) => !set.getSibling())) {
                                round2Set.setLosersSet(loserSet)
                                round1Set.setLosersSet(loserSet)
                                if (nextRoundSets[Math.floor(parentIndex / 2)]) nextRoundSets[Math.floor(parentIndex / 2)].addSet(loserSet)
                                else nextRoundSets.find((set) => !set.leftWinnerSet || !set.rightWinnerSet)!.addSet(loserSet)
                            } else {
                                if (round1Set.getSibling()) {
                                    round1Set.setLosersSet(loserSet)
                                    round1Set.getSibling()!.setLosersSet(loserSet)
                                    if (nextRoundSets[index] && loserSet) {
                                        nextRoundSets[index].addSet(loserSet)
                                        round2Set.setLosersSet(loserSet!.parentSet!)
                                    }
                                } else {
                                    winnersRound2.slice(0).reverse()[index].setLosersSet(nextRoundSets[index])
                                    round1Set.setLosersSet(nextRoundSets[index])
                                }
                            }
                        })

                    this.getAllWinnersSets()
                        .filter((set) => set.loserSet)
                        .forEach((set) => {
                            firstTimeLoserSets = firstTimeLoserSets.filter((firstTimeLoserSet) => firstTimeLoserSet.setId !== set.setId)
                        })

                    break
                default:
                    if (nextRoundSets.length) {
                        if (currentRoundSets.length !== nextRoundSets.length) {
                            currentRoundSets
                                .forEach((set) => {
                                    const parent = nextRoundSets.find((parent) => !parent.leftSet || !parent.rightSet)
                                    parent!.addSet(set)
                                })
                        } else {
                            currentRoundSets
                                .forEach((set, index) => {
                                    const parent = nextRoundSets[index]
                                    parent.addSet(set)
                                })
                        }

                        if (firstTimeLoserSets.length) {
                            if (round === 2) currentRoundSets.reverse()
                            currentRoundSets.forEach((set) => {
                                if (!set.leftWinnerSet && !set.leftSet) {
                                    const firstTimeLoserSet = firstTimeLoserSets.shift()!
                                    firstTimeLoserSet.setLosersSet(set)
                                }

                                if (!set.rightWinnerSet && !set.rightSet) {
                                    const firstTimeLoserSet = firstTimeLoserSets.shift()!
                                    firstTimeLoserSet.setLosersSet(set)
                                }
                            })
                        }
                    }
                    break
            }

            round++
        }

        return losersBracket.slice(-1)[0]
    }

    createLosersBracket (winnersFinals: BracketSet) {
        if (this.numberOfEntrants <= 2) return winnersFinals

        const losersSets = [] as unknown as BracketSet[]
        const firstTimeLosers = this.getSetsByRound(1).length + this.getSetsByRound(2).length
        const firstTimeLosersByes = this.findHighestPowerOf2(firstTimeLosers) - firstTimeLosers
        const setId = winnersFinals.setId! + 1

        let setIdIncrement = 0
        let numberOfSets = 0
        let surplus = 0
        let round = 1
        let winnersRound = round

        while (setIdIncrement < this.numberOfEntrants - 2) {
            const winnersRoundSets = this.getSetsByRound(winnersRound)
            const previousRoundSets = losersSets.filter((set) => set.round! === round - 1)

            if (!winnersRoundSets.length) winnersRoundSets.push(...this.getSetsByRound(winnersRound - 1))

            switch (round) {
                case 1:
                    numberOfSets = (firstTimeLosers - firstTimeLosersByes) / 2
                    surplus = winnersRoundSets.length - (numberOfSets * 2)

                    for (let i = 0; i < numberOfSets; i++) {
                        losersSets[setIdIncrement] = new BracketSet({
                            setId: setId + setIdIncrement,
                            type: "losers",
                            round: round
                        })
                        setIdIncrement++
                    }

                    break
                case 2:
                    numberOfSets = (firstTimeLosersByes + previousRoundSets.length) / 2

                    for (let i = 0; i < numberOfSets; i++) {
                        losersSets[setIdIncrement] = new BracketSet({
                            setId: setId + setIdIncrement,
                            type: "losers",
                            round: round
                        })
                        setIdIncrement++
                    }

                    surplus = 0

                    break
                default:
                    if (this.isPowerOf2(previousRoundSets.length + winnersRoundSets.length)) {
                        numberOfSets = (previousRoundSets.length + winnersRoundSets.length) / 2
                    } else {
                        if (this.isPowerOf2(previousRoundSets.length + surplus)) {
                            numberOfSets = (previousRoundSets.length + surplus) / 2
                            surplus = winnersRoundSets.length
                        } else numberOfSets = previousRoundSets.length / 2
                    }

                    for (let i = 0; i < numberOfSets; i++) {
                        losersSets[setIdIncrement] = new BracketSet({
                            setId: setId + setIdIncrement,
                            type: "losers",
                            round: round
                        })
                        setIdIncrement++
                    }

                    break
            }

            winnersRound++
            round++
        }

        return this.linkLosersSets(losersSets.flat())
    }

    getSetById(id: number, set = this.root!): BracketSet | undefined {
        let found = undefined
        if (set.setId === id) return set
        if (set.leftSet) found = this.getSetById(id, set.leftSet)
        if (set.rightSet && !found) found = this.getSetById(id, set.rightSet)
        return found
    }

    getAllWinnersSets () {
        let round = 1
        const rounds = this.calculateRounds()
        const result = []
        while (round <= rounds) {
            result.push(this.getSetsByRound(round, {type: "winners"}))
            round++
        }
        return result.flat()
    }

    getAllLosersSets () {
        let round = 1
        const rounds = this.calculateRounds()
        const result = []
        while (round <= rounds) {
            result.push(this.getSetsByRound(round, {type: "losers"}))
            round++
        }
        return result.flat()
    }

    getSetsByRound(round: number, filters?: {
        set?: BracketSet,
        type?: "winners" | "losers"
    }): BracketSet[] {
        const {set = this.root!, type = false} = filters ? filters : {}
        const sets = [] as BracketSet[]
        if (set.round === round) sets.push(set)
        if (set.leftSet) sets.push(...this.getSetsByRound(round, {set: set.leftSet}))
        if (set.rightSet) sets.push(...this.getSetsByRound(round, {set: set.rightSet}))
        if (type) return sets.filter((game) => game.type === type)
        return sets
    }

    calculateRounds(size: number = this.numberOfEntrants) {
        let rounds = 1
        while (Math.pow(2,rounds) < size) rounds++
        return rounds
    }

    findHighestPowerOf2(threshold: number = this.numberOfEntrants) {
        if (threshold < 2) return threshold
        if (this.isPowerOf2(threshold)) return threshold
        let i = 1
        while (threshold > Math.pow(2, i) && threshold !== Math.pow(2, i)) i++
        return Math.pow(2, i)
    }

    isPowerOf2(x: number) { return (Math.log2(x) % 1 === 0) }
    addMetaData(data: BracketMetaData) { this.other = Object.assign(this.other, data) }
}

export default BracketEvent
