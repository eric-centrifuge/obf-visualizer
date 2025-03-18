export class BracketEntrant {
    entrantID: number | string
    entrantTag = ""
    initialSeed: number
    finalPlacement?: number
    other: { [key: string]: never }

    constructor(props: {
        entrantID: number | string
        initialSeed?: number
        entrantTag: string
        finalPlacement?: number
        other?: never
    }) {
        const {
            entrantID,
            initialSeed,
            entrantTag,
            finalPlacement,
            other
        } = props
        this.entrantID = entrantID
        this.initialSeed = initialSeed || 0
        this.entrantTag = entrantTag
        this.finalPlacement = finalPlacement || 0
        this.other = other!
    }

    setSeed(seed: number) {
        this.initialSeed = seed
    }

    setName(name: string) {
        this.entrantTag = name
    }

    setMetaData(data: { [key: string]: never }) {
        this.other = {...this.other!, ...data}
    }
}

export default BracketEntrant
