// @ts-expect-error ts(2307)
import './App.css'
import {Button, Center, Container, Field, Heading, Input, SegmentGroup, VStack} from "@chakra-ui/react"
import {useRef, useState} from "react"
import {toaster} from "./components/ui/toaster"
import BracketViewer from "./components/layout/BracketViewer"
import {EntrantsContext, EventContext, SetsContext} from "./contexts/main.tsx"
import {OBFEvent} from "./types/obf.ts"

function App() {
    const [tournamentData, setTournamentData] = useState<OBFEvent|undefined>(undefined)
    const formRef = useRef<HTMLFormElement>(null)
    const [value, setValue] = useState<string | null>("start.gg")
    const [loading, setLoading] = useState(false)

    const onSubmit = (data: FormData) => {
        return fetch(`/api/export`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api: data.get("api"),
                url: data.get("url")
            })
        })
    }

    return (
    <Container maxW={"full"} overflowX={"visible"}>
        {
            !tournamentData && (
                <VStack h={"100%"} justifyContent={"center"} w={"container.xl"} gap={5}>
                    <Center>
                        <Heading size={"3xl"}>Open Bracket Visualizer</Heading>
                    </Center>

                    <form ref={formRef} onSubmit={(e) => {
                        e.preventDefault()
                        setLoading(true)
                        onSubmit(new FormData(formRef.current as unknown as HTMLFormElement))
                            .then(async (res) => {
                                if (res.ok) {
                                    const data = await res.json()
                                    setTournamentData(data)
                                } else {
                                    setTournamentData(undefined)
                                    toaster.error({
                                        title: "Error",
                                        description: (await res.json() as {error: string}).error,
                                        duration: 5000,
                                        placement: "bottom-end"
                                    })
                                }
                            })
                            .finally(() => setLoading(false))
                    }}>
                        <VStack gap={5}>
                            <Field.Root>
                                <Field.Label>Source API</Field.Label>
                                <SegmentGroup.Root
                                    name={"api"}
                                    defaultValue={"mtch.gg"}
                                    value={value}
                                    onValueChange={(e: {value: string}) => setValue(e.value)}>
                                    <SegmentGroup.Indicator />
                                    <SegmentGroup.Items
                                        items={[
                                            {
                                                value: "mtch.gg",
                                                label: <>mtch.gg</>
                                            },
                                            {
                                                value: "start.gg",
                                                label: <>start.gg</>
                                            },
                                            {
                                                value: "challonge",
                                                label: <>challonge</>
                                            }
                                        ]}
                                    />
                                </SegmentGroup.Root>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Event URL Slug</Field.Label>
                                <Input
                                    variant={"subtle"}
                                    name={"url"}
                                    placeholder="Enter Event URL Slug"
                                    required
                                />
                            </Field.Root>

                            <Button loading={loading} type="submit">Render Bracket</Button>
                        </VStack>
                    </form>
                </VStack>
            )
        }
        {
            tournamentData && (
                <VStack>
                    <Heading fontSize={"1.5rem"} mb={5}>
                        { tournamentData.event.name }
                    </Heading>
                    <Button onClick={() => setTournamentData(undefined)}>Reset</Button>
                </VStack>
            )
        }
        { tournamentData && (
            <>
                <EventContext value={tournamentData.event}>
                    <EntrantsContext value={tournamentData.entrants}>
                        <SetsContext value={tournamentData.sets}>
                            <BracketViewer/>
                        </SetsContext>
                    </EntrantsContext>
                </EventContext>
            </>
        )}
    </Container>
    )
}

export default App
