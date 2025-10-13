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
import packageJSON from "../package.json"

function App() {
    const [tournamentData, setTournamentData] = useState<OBFEvent|undefined>(undefined)
    const formRef = useRef<HTMLFormElement>(null)
    const [hostName, setHostName] = useState<string | null>("www.start.gg")
    const [loading, setLoading] = useState(false)

    const onSubmit = (data: FormData) => {
        const api = data.get("hostname") as string
        const url = new URL(data.get("url") as string)

        if (!url.hostname.includes(api)) {
            toaster.error({
                title: "Error",
                description: "Invalid URL. Please ensure the URL is from the selected API.",
                duration: 5000,
                placement: "bottom-end"
            })
            return new Promise((resolve) => resolve(new Response("Invalid URL", {status: 400})))
        } else {
            return fetch(`/api/export`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    api,
                    url
                })
            })
        }
    }

    const placeholders = (api: string) => {
        switch (api) {
            case "www.start.gg":
                return "https://www.start.gg/tournament/community-showcase-at-evo-2023/event/dnf-duel-playstation-4-pro/brackets/1421161/2154110"
            case "challonge.com":
                return "https://challonge.com/DSASIA1"
            case "mtch.gg":
                return "https://mtch.gg/events/2dcd1eaa-b6bc-43d3-afd6-eb142b796e5d"
        }
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
                            <Text>v{packageJSON.version}</Text>
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
                                        // @ts-expect-error res is unknown
                                        .then(async (res: Response) => {
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
                                                name={"hostname"}
                                                mx={"auto"}
                                                value={hostName}
                                                onValueChange={(e: {value: string}) => setHostName(e.value)}>
                                                <SegmentGroup.Indicator />
                                                <SegmentGroup.Items
                                                    items={[
                                                        {
                                                            value: "www.start.gg",
                                                            label: <>start.gg</>
                                                        },
                                                        {
                                                            value: "challonge.com",
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
                                            <Field.HelperText>Example: {placeholders(hostName as string)}</Field.HelperText>
                                        </Field.Root>

                                        <Button loading={loading} type="submit">Preview Bracket</Button>
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
                            <Text>
                                Brackets rendered using <Link href={"https://github.com/openbracketformat/openbracketformat"}><Em>Open Bracket Format</Em></Link>
                            </Text>
                            <Text>
                                made by <Link href={"https://x.com/jaxvex"}><Em>@jaxvex</Em></Link>
                            </Text>
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
