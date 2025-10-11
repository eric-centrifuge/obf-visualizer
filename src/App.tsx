// @ts-expect-error ts(2307)
import './App.css'
import {
    Button,
    Container,
    Em,
    Field,
    Group,
    Heading,
    Icon,
    Input,
    Link,
    SegmentGroup,
    Text,
    VStack
} from "@chakra-ui/react"
import {useRef, useState} from "react"
import {toaster} from "./components/ui/toaster"
import BracketViewer from "./components/layout/BracketViewer"
import {EntrantsContext, EventContext, SetsContext} from "./contexts/main.tsx"
import {OBFEvent} from "./types/obf.ts"
import {FaExternalLinkAlt, FaGithub} from "react-icons/fa"
import {Tooltip} from "./components/ui/tooltip"

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
        <VStack
            minH={"100vh"}
            h={"100%"}
            gap={5}
            asChild>
            <main>
                <Container
                    py={5}
                    maxW={"full"}
                    asChild>
                    <header>
                        <VStack>
                            <Heading size={"3xl"}>Open Bracket Visualizer</Heading>
                            <Text>v1.0.0</Text>
                        </VStack>
                    </header>
                </Container>
                <Container
                    flexGrow={1}
                    maxW={"full"}
                    overflowX={"visible"}>
                    {
                        !tournamentData && (
                            <VStack h={"100%"} justifyContent={"center"} gap={5}>
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
                                        <Field.Root maxW={"300px"}>
                                            <SegmentGroup.Root
                                                name={"api"}
                                                mx={"auto"}
                                                value={value}
                                                onValueChange={(e: {value: string}) => setValue(e.value)}>
                                                <SegmentGroup.Indicator />
                                                <SegmentGroup.Items
                                                    items={[
                                                        {
                                                            value: "start.gg",
                                                            label: <>start.gg</>
                                                        },
                                                        {
                                                            value: "challonge",
                                                            label: <>challonge</>
                                                        },
                                                        {
                                                            value: "mtch.gg",
                                                            label: <>mtch.gg</>
                                                        }
                                                    ]}
                                                />
                                            </SegmentGroup.Root>
                                        </Field.Root>

                                        <Field.Root maxW={"300px"}>
                                            <Field.Label>Event URL</Field.Label>
                                            <Input
                                                variant={"subtle"}
                                                name={"url"}
                                                placeholder="Enter Event URL Slug"
                                                maxW={"300px"}
                                                type={"text"}
                                                autoComplete={"off"}
                                                autoCorrect={"off"}
                                                autoCapitalize={"off"}
                                                spellCheck={false}
                                                autoFocus={true}
                                                _invalid={{
                                                    color: "red.500",
                                                }}
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
                                <Heading fontSize={"1.5rem"} my={5}>
                                    <Group gap={5}>
                                        <FaExternalLinkAlt />
                                        <Link href={tournamentData.event.originURL} target={"_blank"} rel={"noreferrer"}>
                                            <Em>{ tournamentData.event.name }</Em>
                                        </Link>
                                    </Group>
                                </Heading>
                                <Button onClick={() => setTournamentData(undefined)}>Reset</Button>
                            </VStack>
                        )
                    }
                    {
                        tournamentData && (
                            <>
                                <EventContext value={tournamentData.event}>
                                    <EntrantsContext value={tournamentData.entrants}>
                                        <SetsContext value={tournamentData.sets}>
                                            <BracketViewer/>
                                        </SetsContext>
                                    </EntrantsContext>
                                </EventContext>
                            </>
                        )
                    }
                </Container>
                <Container
                    mt={"auto"}
                    py={5}
                    maxW={"full"}
                    asChild>
                    <footer>
                        <VStack>
                            <Text>made by <Link href={"https://x.com/jaxvex"}><Em>Jaxvex</Em></Link></Text>
                            <Group gap={2}>
                                <Tooltip content={"GitHub"}>
                                    <Link href="https://github.com/eric-centrifuge/obf-visualizer" target={"_blank"} rel={"noreferrer"}>
                                        <Icon as={FaGithub} boxSize={"25px"} />
                                    </Link>
                                </Tooltip>
                            </Group>
                        </VStack>
                    </footer>
                </Container>
            </main>
        </VStack>
    )
}

export default App
