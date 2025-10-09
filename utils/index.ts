export const startggRequest = async ({
    data
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: {[key: string]: any}
}) => {
    const response = await fetch(`${process.env.STARTGG_API_ENDPOINT}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${process.env.STARTGG_TOKEN}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    })
    if (response.ok) return await response.json()
    else return null
}
