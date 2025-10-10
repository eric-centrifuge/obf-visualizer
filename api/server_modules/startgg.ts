import {IEntrant, IEvent, ISet} from "../../src/types/obf.ts";

export const startggRequest = async ({
 data
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
}) => {
    const response = await fetch(`${process.env.STARTGG_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${process.env.STARTGG_KEY}`
        },
        body: JSON.stringify(data),
    })
    if (response.ok) return await response.json()
    else return undefined
}

export const getStartggEvent = async (slug: string) => {
  const query = `
      query getInfo($slug:String) {
        event(slug:$slug) {
          id
          numEntrants
          startAt
          slug
          tournament {
            name
            tournamentType
          }
          videogame {
            displayName
            name
          }
          entrants(query:{
            perPage: 100
          }) {
            pageInfo {
              total
              totalPages
            }
          }
          sets(perPage:25) {
            pageInfo {
              total
              totalPages
            }
          }
          phases {
            id
            name
            bracketType
          }
        }
      }
  `
    const { data } = await startggRequest({
        data: {
            query,
            variables: { slug }
        }
    }) as any

    const tournamentType = (type: number) => {
      switch (type) {
          case 1:
              return "double elimination"
          case 2:
              return "single elimination"
          default:
              return "unknown"
      }
    }

    if (data) {
        const { event } = data
        return ({
            name: event.tournament.name,
            numberEntrants: event.numEntrants,
            tournamentStructure: tournamentType(event.tournament.tournamentType),
            date: event.startAt,
            originURL: event.slug,
            game: event.videogame.displayName,
            phases: event.phases.map((phase) => phase),
            other: {
                startTime: event.startAt,
                eventID: event.id,
            }
        } as unknown as IEvent)
    }
    else return undefined
}

export const getStartggEntrants = async (slug: string) => {
    const entrants = [] as IEntrant[]
    const query = `
        query getEntrants($slug:String, $currentPage:Int) {
          event(slug:$slug) {
            entrants(query:{
              page : $currentPage,
              perPage: 100
            }) {
              pageInfo {
                total
                totalPages
                page
              }
              nodes {
                id
                name
                initialSeedNum
                standing {
                  placement
                }
                participants {
                  gamerTag
                  prefix
                  user {
                    name
                    location {
                      country
                    }
                  }
                }
              }
            }
          }
        }
    `

    const { data } = await startggRequest({
        data: {
            query,
            variables: {
                slug,
                currentPage: 1,
            }
        }
    }) as any

    if (data) {
        data.event.entrants.nodes.forEach((entrant) => {
            entrants.push({
                entrantID: entrant.id,
                initialSeed: entrant.initialSeedNum,
                finalPlacement: entrant.standing.placement,
                entrantTag: entrant.participants[0].gamerTag,
                personalInformation: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    {
                        name: entrant.participants[0].user.name || entrant.name,
                        country: entrant.participants[0].user.location ? `${entrant.participants[0].user.location.country}` : "",
                        tag: entrant.participants[0].gamerTag,
                        prefix: entrant.participants[0].prefix,
                    }
                ],
                other: {
                    // image: entrant.participants[0].images[0],
                }
            })
        })
    }

    return entrants
}

export const getStartggSets = async (slug: string) => {
    const sets = [] as ISet[]
    const query = `
        query getSets($slug: String) {
          event(slug: $slug) {
            sets(page: 1, perPage:25) {
              pageInfo {
                total
                totalPages
                page
              }
              nodes {
                id
                identifier
                displayScore
                winnerId
                state
                totalGames
                fullRoundText
                games {
                  winnerId
                  orderNum
                  selections {
                    selectionValue
                    entrant {
                      id
                    }
                  }
                  stage {
                    name
                  }
                }
                phaseGroup {
                  id
                  phase {
                    id
                    name
                  }
                }
                slots {
                  prereqType
                  prereqId
                  entrant {
                    id
                  }
                }
              }
            }
          }
        }
    `

    const { data } = await startggRequest({
        data: {
            query,
            variables: {
                slug,
                currentPage: 1
            }
        }
    }) as any

    if (data) {
        data.event.sets.nodes.forEach((set) => {
            sets.push({
                setID: set.identifier,
                status: set.state,
                winnerID: set.winnerId,
                entrant1ID: set.slots[0].entrant.id,
                entrant2ID: set.slots[1].entrant.id,
                entrant1PrevSetID: set.slots[0].prereqId,
                entrant2PrevSetID: set.slots[1].prereqId,
                entrant1NextSetID: "",
                entrant2NextSetID: "",
                entrant1Status: set.state,
                entrant2Status: set.state,
                other: {}
            })
        })
    }

    return sets
}
