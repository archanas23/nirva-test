// Mock webhook for development
export default async function handler(req: any, res: any) {
  console.log('Webhook received:', req.body)
  res.json({ received: true })
}
