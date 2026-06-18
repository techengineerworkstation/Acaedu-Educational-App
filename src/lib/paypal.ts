// PayPal Integration
// Uses PayPal JS SDK for client-side payments

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

interface PayPalConfig {
  amount: string
  currency: string
  description: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}

export async function initializePayPal(config: PayPalConfig) {
  if (!PAYPAL_CLIENT_ID) {
    config.onError('PayPal client ID not configured')
    return
  }

  // Load PayPal script if not already loaded
  if (!(window as any).paypal) {
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${config.currency}`
    script.onload = () => renderPayPalButton(config)
    script.onerror = () => config.onError('Failed to load PayPal SDK')
    document.head.appendChild(script)
  } else {
    renderPayPalButton(config)
  }
}

function renderPayPalButton(config: PayPalConfig) {
  ;(window as any).paypal.Buttons({
    createOrder: (_data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          description: config.description,
          amount: {
            currency_code: config.currency,
            value: config.amount,
          },
        }],
      })
    },
    onApprove: async (_data: any, actions: any) => {
      const order = await actions.order.capture()
      config.onSuccess(order.id)
    },
    onError: (err: any) => {
      config.onError(err.message || 'PayPal payment failed')
    },
  }).render('#paypal-button-container')
}

export async function capturePayPalOrder(orderId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/paypal/capture?order_id=${orderId}`)
    const data = await response.json()
    return data.status === 'COMPLETED'
  } catch {
    return false
  }
}
