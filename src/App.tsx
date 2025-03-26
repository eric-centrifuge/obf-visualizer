import {useForm} from 'react-hook-form';
import './App.css'
import {Box, Button, Field, Text, Input, Stack, Center, ProgressCircle, Container} from "@chakra-ui/react";
import BracketViewer from "@/components/layout/BracketViewer.tsx";
import {useState} from "react";
import {Sample} from "@/types/obf";

interface FormValues { url: string }

function App() {
    const [tournamentData, setTournamentData] = useState(undefined)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true)
        const OBFrequest = await fetch(`${import.meta.env.VITE_OBF_EXPORTER_ENDPOINT}`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({bracket: data.url})
        })
        if (OBFrequest.ok) setTournamentData(await OBFrequest.json())
        else console.error("Failed to fetch tournament from exporter.")
        setIsLoading(false)
    })

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

    return (
    <Container maxW={"full"} overflowX={"scroll"}>
        <Text as={"h1"} mb={5}>Open Bracket Visualizer</Text>
        <Box mb={5}>
            <form onSubmit={onSubmit}>
                <Stack gap="4" align="flex-start" maxW="sm">
                    <Field.Root invalid={!!errors.url}>
                        <Field.Label>Bracket URL</Field.Label>
                        <Input
                            style={{
                                backgroundColor: "#FFF",
                                color: "#000"
                            }}
                            {...register("url")}
                            placeholder="Event Link: e.g. https://www.start.gg/tournament/collision-2023-5/event/melee-singles"/>
                        <Field.ErrorText>{errors.url?.message}</Field.ErrorText>
                    </Field.Root>
                    <Button type="submit">Submit</Button>
                </Stack>
            </form>
        </Box>
        { isLoading && <Center>{LoadingIcon()}</Center> }
        { !isLoading && tournamentData && <Center><Text as={"h2"} fontSize={"1.5rem"} mb={5}>{(tournamentData as Sample).event.name}</Text></Center> }
        { !isLoading && tournamentData && <BracketViewer tournament={tournamentData}/> }
    </Container>
    )
}

export default App
