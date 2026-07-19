// CRM Integration Layer
// Supports HubSpot, Salesforce, and Zendesk
// Requires env vars: VITE_HUBSPOT_API_KEY, VITE_SALESFORCE_CLIENT_ID, VITE_ZENDESK_API_KEY

const HUBSPOT_KEY = import.meta.env.VITE_HUBSPOT_API_KEY || ''
const SALESFORCE_ID = import.meta.env.VITE_SALESFORCE_CLIENT_ID || ''
const ZENDESK_KEY = import.meta.env.VITE_ZENDESK_API_KEY || ''

export type CRMProvider = 'hubspot' | 'salesforce' | 'zendesk'

export interface CRMContact {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  role?: string
  plan?: string
  subscriptionStatus?: string
}

// ─── HubSpot ─────────────────────────────────────────────
async function hubspotRequest(endpoint: string, method: string, body?: any) {
  if (!HUBSPOT_KEY) throw new Error('HubSpot API key not configured')
  const response = await fetch(`https://api.hubapi.com${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${HUBSPOT_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`HubSpot error: ${err}`)
  }
  return response.json()
}

// ─── Salesforce ──────────────────────────────────────────
async function salesforceRequest(endpoint: string, method: string, body?: any, accessToken?: string) {
  if (!SALESFORCE_ID) throw new Error('Salesforce client ID not configured')
  const response = await fetch(`https://login.salesforce.com/services/data/v58.0${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Salesforce error: ${err}`)
  }
  return response.json()
}

// ─── Zendesk ─────────────────────────────────────────────
async function zendeskRequest(endpoint: string, method: string, body?: any) {
  if (!ZENDESK_KEY) throw new Error('Zendesk API key not configured')
  const response = await fetch(`https://d3v-acaedu.zendesk.com/api/v2${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${ZENDESK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Zendesk error: ${err}`)
  }
  return response.json()
}

// ─── Unified CRM Functions ──────────────────────────────

export async function syncContact(provider: CRMProvider, contact: CRMContact): Promise<any> {
  switch (provider) {
    case 'hubspot':
      return hubspotRequest('/crm/v3/objects/contacts', 'POST', {
        properties: {
          email: contact.email,
          firstname: contact.firstName,
          lastname: contact.lastName,
          phone: contact.phone,
          company: contact.company,
          jobtitle: contact.role,
          plan_name: contact.plan,
          subscription_status: contact.subscriptionStatus,
        },
      })
    case 'salesforce':
      return salesforceRequest('/sobjects/Contact', 'POST', {
        Email: contact.email,
        FirstName: contact.firstName,
        LastName: contact.lastName,
        Phone: contact.phone,
        AccountName: contact.company,
        Title: contact.role,
      })
    case 'zendesk':
      return zendeskRequest('/users/create_or_update', 'POST', {
        user: {
          email: contact.email,
          name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          phone: contact.phone,
          organization: contact.company,
          role: 'end-user',
          user_fields: {
            plan: contact.plan,
            subscription_status: contact.subscriptionStatus,
          },
        },
      })
  }
}

export async function createTicket(
  provider: CRMProvider,
  subject: string,
  description: string,
  email: string,
  priority: 'urgent' | 'high' | 'normal' | 'low' = 'normal'
): Promise<any> {
  switch (provider) {
    case 'hubspot':
      return hubspotRequest('/crm/v3/objects/tickets', 'POST', {
        properties: {
          subject,
          content: description,
          hs_ticket_priority: priority.toUpperCase(),
          hs_pipeline_stage: '1',
          hs_email: email,
        },
      })
    case 'salesforce':
      return salesforceRequest('/sobjects/Case', 'POST', {
        Subject: subject,
        Description: description,
        SuppliedEmail: email,
        Priority: priority === 'urgent' ? '1' : priority === 'high' ? '2' : '3',
        Status: 'New',
      })
    case 'zendesk':
      return zendeskRequest('/tickets', 'POST', {
        ticket: {
          subject,
          description,
          requester: { email },
          priority,
          status: 'new',
        },
      })
  }
}

export async function syncSubscription(
  provider: CRMProvider,
  email: string,
  plan: string,
  status: string,
  _expiresAt?: string
) {
  return syncContact(provider, {
    email,
    plan,
    subscriptionStatus: status,
  })
}

// Get active CRM provider based on available keys
export function getActiveProvider(): CRMProvider | null {
  if (HUBSPOT_KEY) return 'hubspot'
  if (SALESFORCE_ID) return 'salesforce'
  if (ZENDESK_KEY) return 'zendesk'
  return null
}
