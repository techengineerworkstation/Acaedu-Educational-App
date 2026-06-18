// Paystack Integration
// Uses Paystack InlineJS for client-side payments

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

interface PaystackConfig {
  email: string
  amount: number // in kobo (100 = NGN 1.00)
  currency?: string
  reference?: string
  onSuccess: (reference: string) => void
  onClose: () => void
}

export function initializePaystack(config: PaystackConfig) {
  if (!PAYSTACK_PUBLIC_KEY) {
    console.error('Paystack public key not configured')
    return
  }

  // Load Paystack script if not already loaded
  if (!(window as any).PaystackPop) {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => openPaystack(config)
    document.head.appendChild(script)
  } else {
    openPaystack(config)
  }
}

function openPaystack(config: PaystackConfig) {
  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'NGN',
    ref: config.reference || `acaedu_${Date.now()}`,
    metadata: {
      custom_fields: [{
        display_name: 'Platform',
        variable_name: 'platform',
        value: 'acaedu'
      }]
    },
    callback: (response: any) => {
      config.onSuccess(response.reference)
    },
    onClose: () => {
      config.onClose()
    }
  })
  handler.openIframe()
}

// Verify payment on server (Supabase Edge Function)
export async function verifyPaystackPayment(reference: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/paystack/verify?reference=${reference}`)
    const data = await response.json()
    return data.status === 'success'
  } catch {
    return false
  }
}
