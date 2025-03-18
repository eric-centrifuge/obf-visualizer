export class BracketEntrant {
    entrantID: number | string
    entrantTag = ""
    initialSeed: number
    finalPlacement?: number
    record = [0, 0]
    other: { [key: string]: any }

    constructor(props: {
        entrantID: number | string
        initialSeed?: number
        entrantTag: string
        other?: any
    }) {
        const {
            entrantID,
            initialSeed,
            entrantTag,
            other
        } = props
        this.entrantID = entrantID
        this.initialSeed = initialSeed || 0
        this.entrantTag = entrantTag
        this.other = other
    }

    setSeed(seed: number) {
        this.initialSeed = seed
    }

    setName(name: string) {
        this.entrantTag = name
    }

    setMetaData(data: { [key: string]: any }) {
        this.other = {...this.other, ...data}
    }
}

export default BracketEntrant
