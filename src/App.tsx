import './App.css'
import {
    Button,
    Center,
    Container,
    Field,
    Heading,
    Input,
    ProgressCircle,
    SegmentGroup,
    Text,
    VStack
} from "@chakra-ui/react"
import {useRef, useState} from "react"
import {Sample} from "@/types/obf"
import {toaster} from "./components/ui/toaster"
import BracketViewer from "./components/layout/BracketViewer"

function App() {
    const [tournamentData, setTournamentData] = useState(undefined)
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

    const LoadingIcon = () => {
        return (
            <ProgressCircle.Root value={null} size="sm">
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range />
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        )
    }

    const apiPrefix = (api: string) => {
        switch (api) {
            case "mtch.gg":
                return "https://mtch.gg/api/v1"
            case "start.gg":
                return "https://api.start.gg/gql/alpha"
            case "challonge":
                return "https://api.challonge.com/v1"
            default:
                return "https://mtch.gg/api/v1"
        }
    }

    return (
    <Container maxW={"full"} h={"100vh"} overflowX={"visible"}>
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
                                    console.log(data)
                                } else {
                                    setTournamentData(undefined)
                                    toaster.error({
                                        title: "Error",
                                        description: (await res.json() as any).error,
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
                                    onValueChange={(e) => setValue(e.value)}>
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
                                />
                            </Field.Root>

                            <Button loading={loading} type="submit">Render Bracket</Button>
                        </VStack>
                    </form>
                </VStack>
            )
        }
        { tournamentData && <Center><Text as={"h2"} fontSize={"1.5rem"} mb={5}>{(tournamentData as Sample).event.name}</Text></Center> }
        { tournamentData && <BracketViewer tournament={tournamentData}/> }
    </Container>
    )
}

export default App
