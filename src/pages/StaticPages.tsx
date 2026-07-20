import { motion } from 'framer-motion'
import { useState } from 'react'
import { sendEmail } from '../lib/email'

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-extrabold mb-2 text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
          Terms of Service
        </h1>
        <div className="h-px my-6" style={{ background: 'var(--color-border-light)' }} />
        <div className="space-y-8" style={{ color: 'var(--color-text-secondary)' }}>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using Acaedu (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              2. User Accounts
            </h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify
              us immediately of any unauthorized use of your account. You must provide accurate and complete information
              during registration.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              3. Acceptable Use
            </h2>
            <p className="leading-relaxed">You agree to use the Platform only for lawful academic purposes. You shall not:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 leading-relaxed">
              <li>Share false or misleading information</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
              <li>Use the Platform for commercial purposes without authorization</li>
              <li>Upload malicious content or spam</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              4. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on the Platform, including text, graphics, logos, and software, is the property of Acaedu and
              is protected by copyright laws.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              Acaedu shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              6. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the Platform constitutes acceptance
              of the modified terms.
            </p>
          </section>
          <p className="text-xs pt-6" style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)' }}>
            Last updated: January 2026
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-extrabold mb-2 text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
          Privacy Policy
        </h1>
        <div className="h-px my-6" style={{ background: 'var(--color-border-light)' }} />
        <div className="space-y-8" style={{ color: 'var(--color-text-secondary)' }}>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">We collect information you provide directly, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 leading-relaxed">
              <li>Name, email, and contact information</li>
              <li>Academic records and course enrollments</li>
              <li>Usage data and interaction logs</li>
              <li>Payment information (processed securely by Paystack/PayPal)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">Your information is used to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 leading-relaxed">
              <li>Provide and improve the Platform</li>
              <li>Send academic notifications and announcements</li>
              <li>Process payments and subscriptions</li>
              <li>Generate analytics and reports</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              3. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, secure
              authentication, and regular security audits.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              4. Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We use Supabase for authentication and database, Resend for email delivery, and Paystack/PayPal for
              payments. These services have their own privacy policies.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              5. Your Rights
            </h2>
            <p className="leading-relaxed">
              You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.
            </p>
          </section>
          <p className="text-xs pt-6" style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)' }}>
            Last updated: January 2026
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) { setError('Please fill in all fields.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    setSending(true); setError('')
    try {
      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h2 style="color:#1B3A5C">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1rem">
            <tr><td style="padding:8px 0;color:#555;width:80px"><strong>Name:</strong></td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555"><strong>Email:</strong></td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;vertical-align:top"><strong>Message:</strong></td>
              <td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e2db;margin:1.5rem 0"/>
          <p style="color:#888;font-size:0.75rem">Sent from acaedu.sbs contact form</p>
        </div>`
      await sendEmail({ to: 'support@acaedu.sbs', subject: `Contact: ${name}`, html })
      setSent(true); setName(''); setEmail(''); setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please email us directly.')
    }
    setSending(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-extrabold mb-2 text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
          Contact Us
        </h1>
        <div className="h-px my-6" style={{ background: 'var(--color-border-light)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Email', children: <a href="mailto:support@acaedu.sbs" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>support@acaedu.sbs</a> },
            { label: 'Phone', children: <a href="tel:+2349115899245" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>+234 911 589 9245</a> },
            { label: 'WhatsApp', children: <a href="https://wa.me/2349115899245" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Chat on WhatsApp</a> },
            { label: 'Location', children: <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Nigeria</p> },
          ].map(item => (
            <div key={item.label} className="card p-5">
              <h3 className="font-bold mb-1.5 text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>{item.label}</h3>
              {item.children}
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-bold mb-4 text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
            Send us a message
          </h3>

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="py-10 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--color-bg-tertiary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>Message sent!</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                We'll get back to you at <strong>{email || 'your email'}</strong> soon.
              </p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                Send another message
              </button>
            </motion.div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'color-mix(in srgb, var(--color-danger) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)',
                    color: 'var(--color-danger)',
                  }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  Name
                </label>
                <input value={name} onChange={e => setName(e.target.value)} required
                  className="input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  Email
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="input" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  Message
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} required
                  className="textarea" rows={4} placeholder="Your message..." />
              </div>
              <button type="submit" disabled={sending}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
