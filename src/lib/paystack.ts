// Paystack inline integration for NGN payments
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

export interface PaystackConfig {
  email: string
  amount: number // in kobo (NGN * 100)
  currency?: string
  reference?: string
  metadata?: Record<string, any>
  onSuccess?: (reference: string) => void
  onClose?: () => void
}

// Load Paystack script dynamically
function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.head.appendChild(script)
  })
}

export async function initializePayment(config: PaystackConfig) {
  await loadPaystackScript()
  
  const reference = config.reference || `ACAEDU_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  
  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'NGN',
    ref: reference,
    metadata: {
      custom_fields: Object.entries(config.metadata || {}).map(([name, value]) => ({
        display_name: name,
        variable_name: name,
        value,
      })),
    },
    callback: (response: { reference: string }) => {
      config.onSuccess?.(response.reference)
    },
    onClose: () => {
      config.onClose?.()
    },
  })
  
  handler.openIframe()
  return reference
}

export async function verifyPayment(reference: string): Promise<any> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`,
    },
  })
  const result = await response.json()
  return result
}

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount / 100)
}
