// PayPal checkout integration
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

export interface PayPalConfig {
  amount: number
  currency?: string
  description?: string
  onSuccess?: (details: any) => void
  onError?: (error: any) => void
}

// Load PayPal SDK
export function loadPaypalScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load PayPal script'))
    document.head.appendChild(script)
  })
}

export async function renderPaypalButton(
  containerId: string,
  config: PayPalConfig
) {
  await loadPaypalScript()
  
  const paypal = (window as any).paypal
  if (!paypal) throw new Error('PayPal SDK not loaded')

  paypal.Buttons({
    createOrder: (_data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: config.amount.toFixed(2),
            currency_code: config.currency || 'USD',
          },
          description: config.description || 'Acaedu Educational App',
        }],
      })
    },
    onApprove: async (_data: any, actions: any) => {
      const details = await actions.order.capture()
      config.onSuccess?.(details)
    },
    onError: (error: any) => {
      config.onError?.(error)
    },
  }).render(`#${containerId}`)
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
