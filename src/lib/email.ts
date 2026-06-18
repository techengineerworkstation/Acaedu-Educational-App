// Email service using Resend API via Supabase Edge Function
// Deploy the Edge Function first: supabase functions deploy send-email

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || ''
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('Resend API key not configured')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Acaedu <noreply@acaedu.sbs>',
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

// ─── Email Templates ────────────────────────────────────────

const brandColors = {
  primary: '#5B8CC0',
  secondary: '#C9A96E',
  gradient: 'linear-gradient(135deg, #5B8CC0, #C9A96E)',
  bg: '#FAFAF7',
  text: '#1A1A1A',
  textMuted: '#555555',
  border: '#E5E2DB',
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:'Inter',system-ui,-apple-system,sans-serif;margin:0;padding:0;background:${brandColors.bg}">
<div style="max-width:600px;margin:0 auto;padding:2rem">
  <div style="text-align:center;margin-bottom:2rem">
    <div style="width:48px;height:48px;border-radius:12px;background:${brandColors.gradient};display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:1.2rem">A</div>
  </div>
  ${content}
  <hr style="border:none;border-top:1px solid ${brandColors.border};margin:2rem 0">
  <p style="color:#888;font-size:0.75rem;text-align:center">© 2026 Acaedu - Smart Academic Platform</p>
</div>
</body>
</html>`
}

export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to Acaedu!',
    html: emailWrapper(`
      <h1 style="color:${brandColors.text};font-size:1.5rem;text-align:center">Welcome, ${name}!</h1>
      <p style="color:${brandColors.textMuted};line-height:1.7">Your account has been created successfully. You can now access courses, schedules, grades, and more.</p>
      <div style="text-align:center;margin:1.5rem 0">
        <a href="https://acaedu.sbs/dashboard" style="display:inline-block;padding:0.75rem 2rem;background:${brandColors.gradient};color:white;text-decoration:none;border-radius:8px;font-weight:600">Go to Dashboard</a>
      </div>
    `),
  }
}

export function classReminderEmail(name: string, courseName: string, time: string, venue: string): { subject: string; html: string } {
  return {
    subject: `Class Reminder: ${courseName}`,
    html: emailWrapper(`
      <h2 style="color:${brandColors.text};text-align:center">Class Reminder</h2>
      <p style="color:${brandColors.textMuted}">Hello ${name},</p>
      <p style="color:${brandColors.textMuted};line-height:1.7">Your class <strong>${courseName}</strong> is starting soon.</p>
      <div style="background:white;border:1px solid ${brandColors.border};border-radius:12px;padding:1.5rem;margin:1.5rem 0">
        <p style="margin:0.5rem 0;color:${brandColors.text}">📅 <strong>Time:</strong> ${time}</p>
        <p style="margin:0.5rem 0;color:${brandColors.text}">📍 <strong>Venue:</strong> ${venue}</p>
      </div>
    `),
  }
}

export function classCancelledEmail(name: string, courseName: string, reason: string): { subject: string; html: string } {
  return {
    subject: `Class Cancelled: ${courseName}`,
    html: emailWrapper(`
      <h2 style="color:#E11D48;text-align:center">Class Cancelled</h2>
      <p style="color:${brandColors.textMuted}">Hello ${name},</p>
      <p style="color:${brandColors.textMuted};line-height:1.7">The class <strong>${courseName}</strong> has been cancelled.</p>
      <div style="background:#FEF2F2;border:1px solid #FECDD3;border-radius:12px;padding:1.5rem;margin:1.5rem 0">
        <p style="margin:0;color:#E11D48"><strong>Reason:</strong> ${reason}</p>
      </div>
    `),
  }
}

export function gradePublishedEmail(name: string, courseName: string, score: number, grade: string): { subject: string; html: string } {
  return {
    subject: `Grade Published: ${courseName}`,
    html: emailWrapper(`
      <h2 style="color:${brandColors.text};text-align:center">Grade Published</h2>
      <p style="color:${brandColors.textMuted}">Hello ${name},</p>
      <p style="color:${brandColors.textMuted}">Your grade for <strong>${courseName}</strong> has been published.</p>
      <div style="background:white;border:1px solid ${brandColors.border};border-radius:12px;padding:1.5rem;text-align:center;margin:1.5rem 0">
        <div style="font-size:2.5rem;font-weight:800;background:${brandColors.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent">${grade}</div>
        <div style="color:${brandColors.textMuted};font-size:0.85rem;margin-top:0.25rem">Score: ${score}%</div>
      </div>
    `),
  }
}

export function announcementEmail(name: string, title: string, content: string): { subject: string; html: string } {
  return {
    subject: `Announcement: ${title}`,
    html: emailWrapper(`
      <h2 style="color:${brandColors.text};text-align:center">${title}</h2>
      <p style="color:${brandColors.textMuted}">Hello ${name},</p>
      <p style="color:${brandColors.textMuted};line-height:1.7">${content}</p>
    `),
  }
}

export function billingConfirmationEmail(name: string, plan: string, amount: string): { subject: string; html: string } {
  return {
    subject: 'Payment Confirmation - Acaedu',
    html: emailWrapper(`
      <h2 style="color:${brandColors.text};text-align:center">Payment Confirmed</h2>
      <p style="color:${brandColors.textMuted}">Hello ${name},</p>
      <p style="color:${brandColors.textMuted}">Your payment has been processed successfully.</p>
      <div style="background:white;border:1px solid ${brandColors.border};border-radius:12px;padding:1.5rem;margin:1.5rem 0">
        <p style="margin:0.5rem 0"><strong>Plan:</strong> ${plan}</p>
        <p style="margin:0.5rem 0"><strong>Amount:</strong> ${amount}</p>
      </div>
    `),
  }
}
