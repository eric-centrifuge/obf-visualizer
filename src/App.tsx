import {useForm} from 'react-hook-form';
import './App.css'
import {Box, Button, Field, Text, Input, Stack, Center} from "@chakra-ui/react";
import BracketViewer from "@/components/layout/BracketViewer.tsx";
import {useState} from "react";
import {Sample} from "@/types/obf";

interface FormValues { url: string }

function App() {
    const OBFExporterEndpoint = "http://localhost:3015/obf"
    const [tournamentData, setTournamentData] = useState(undefined)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit = handleSubmit(async (data) => {
        const OBFrequest = await fetch(`${OBFExporterEndpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({bracket: data.url})
        })
        if (OBFrequest.ok) setTournamentData(await OBFrequest.json())
        else console.error("Failed to fetch tournament from exporter.")
    })

    return (
    <>
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
        { tournamentData && <Center><Text as={"h2"} fontSize={"1.5rem"} mb={5}>{(tournamentData as Sample).event.name}</Text></Center> }
        { tournamentData ? <BracketViewer tournamentData={tournamentData}/> : <h2>No bracket provided.</h2> }
    </>
    )
}

export default App
