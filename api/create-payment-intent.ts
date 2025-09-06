// For now, let's mock this since we don't have the server-side stripe package
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency, metadata } = req.body

    // Mock response for development
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`
    
    res.status(200).json({ clientSecret: mockClientSecret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
}
