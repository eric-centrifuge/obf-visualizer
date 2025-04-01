// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const response = await fetch('https://api.vercel.app/products')
    const products = await response.json()
    return Response.json(products)
}
