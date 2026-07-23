import { motion } from 'framer-motion'
import { useState } from 'react'
import { sendEmail } from '../lib/email'
import { MapPin, Mail, Phone, Clock, Globe, ExternalLink, Send } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing and using Acaedu ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. These terms apply to all users, including students, lecturers, administrators, and visitors.' },
    { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use. You must provide accurate and complete information during registration. One account per person — sharing accounts is prohibited.' },
    { title: '3. Acceptable Use', content: 'You agree to use the Platform only for lawful academic purposes. You shall not share false or misleading information, attempt to gain unauthorized access to other accounts, use the Platform for commercial purposes without authorization, upload malicious content or spam, or circumvent any security features.' },
    { title: '4. Academic Integrity', content: 'Acaedu promotes academic honesty. Users must not submit plagiarized work, fabricate grades or records, or use AI-generated content to misrepresent original work. Violations may result in account suspension or permanent ban.' },
    { title: '5. Intellectual Property', content: 'All content on the Platform — including text, graphics, logos, software, AI-generated summaries, and design elements — is the property of Acaedu and protected by copyright laws. Users retain ownership of their original academic content but grant Acaedu a license to display and process it within the Platform.' },
    { title: '6. AI-Powered Features', content: 'Acaedu uses artificial intelligence (powered by Groq) for features including lecture summaries, academic advice, career guidance, and smart scheduling. AI-generated content is provided as an auxiliary tool and should not replace professional academic or career advice. We do not guarantee the accuracy of AI outputs.' },
    { title: '7. Data & Privacy', content: 'Your use of the Platform is also governed by our Privacy Policy. By using Acaedu, you consent to the collection and use of data as described therein. We implement industry-standard security including encryption, RLS policies, and SOC 2 compliance.' },
    { title: '8. Payments & Subscriptions', content: 'Paid plans (Pro, Enterprise) are processed through Paystack and PayPal. All fees are non-refundable unless required by applicable law. We reserve the right to modify pricing with 30 days\' notice.' },
    { title: '9. Limitation of Liability', content: 'Acaedu shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.' },
    { title: '10. Termination', content: 'We may suspend or terminate your account at our discretion for violation of these terms. Upon termination, your right to use the Platform ceases immediately. Data may be retained as required by law.' },
    { title: '11. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Material changes will be communicated via email or in-app notification. Continued use constitutes acceptance of modified terms.' },
    { title: '12. Governing Law', content: 'These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos, Nigeria.' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <div className="mb-8">
          <span className="section-label">Legal</span>
          <span className="rule-gold" />
          <h1 className="text-display-sm mt-3">Terms of Service</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-2">Last updated: July 2026 · Effective immediately</p>
        </div>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.section key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease }}
              className="p-5 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)]"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <h2 className="text-[15px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h2>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{s.content}</p>
            </motion.section>
          ))}
        </div>
        <p className="text-[var(--color-text-muted)] text-[11px] mt-8 text-center">© 2026 Acaedu. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', items: ['Name, email, phone, and contact information', 'Academic records: grades, enrollments, attendance, assignments', 'Usage data: pages visited, features used, time spent', 'Device information: browser, OS, IP address', 'Payment details (processed securely via Paystack/PayPal — never stored on our servers)'] },
    { title: '2. How We Use Your Information', items: ['Provide, maintain, and improve the Platform', 'Process enrollments, grades, and academic records', 'Send academic notifications, deadlines, and announcements', 'Generate AI-powered summaries and insights', 'Process payments and manage subscriptions', 'Ensure security and prevent fraud', 'Comply with legal obligations'] },
    { title: '3. Data Sharing', items: ['We do NOT sell your personal data to third parties', 'Data is shared only with: Supabase (hosting/database), Resend (email), Paystack/PayPal (payments), Groq (AI processing)', 'All third-party processors are bound by strict data processing agreements', 'Data may be disclosed if required by law or to protect rights and safety'] },
    { title: '4. Data Security', items: ['AES-256 encryption at rest and TLS 1.3 in transit', 'Row-Level Security (RLS) policies on all database tables', 'SOC 2 Type II compliant infrastructure', 'Regular penetration testing and security audits', 'Automatic session timeout after 30 minutes of inactivity', 'Role-based access control (Admin, Lecturer, Student)'] },
    { title: '5. Your Rights', items: ['Access: Request a copy of all data we hold about you', 'Rectification: Correct any inaccurate data', 'Deletion: Request permanent deletion of your account and data', 'Portability: Export your data in JSON format', 'Objection: Opt out of non-essential data processing', 'Complaint: File a complaint with the relevant data protection authority'] },
    { title: '6. Data Retention', items: ['Active account data: retained while your account is active', 'Academic records: retained for 7 years after last enrollment', 'Usage analytics: anonymized after 24 months', 'Payment records: retained for 7 years (tax/legal compliance)', 'Deleted accounts: purged within 30 days'] },
    { title: '7. Cookies & Tracking', items: ['Essential cookies: required for authentication and security', 'Analytics cookies: help us understand usage patterns (opt-out available)', 'We do NOT use advertising cookies or cross-site tracking'] },
    { title: '8. Children\'s Privacy', items: ['Acaedu is designed for users aged 13 and above', 'For users under 18, parental/guardian consent is required', 'We do not knowingly collect data from children under 13'] },
    { title: '9. International Transfers', items: ['Data is processed in regions where our infrastructure is hosted (US, EU)', 'We ensure adequate safeguards for international data transfers', 'Nigerian users\' rights under NDPR 2019 are fully respected'] },
    { title: '10. Contact Us', content: 'For privacy-related inquiries, contact our Data Protection Officer at DanielEbirim25@gmail.com or via the contact details on our Contact page.' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <div className="mb-8">
          <span className="section-label">Legal</span>
          <span className="rule-gold" />
          <h1 className="text-display-sm mt-3">Privacy Policy</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-2">Last updated: July 2026 · Compliant with NDPR 2019 & GDPR</p>
        </div>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.section key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease }}
              className="p-5 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)]"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <h2 className="text-[15px] font-bold text-[var(--color-navy)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h2>
              {s.items && (
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.content && <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{s.content}</p>}
            </motion.section>
          ))}
        </div>
        <p className="text-[var(--color-text-muted)] text-[11px] mt-8 text-center">© 2026 Acaedu. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export function AboutPage() {
  const stats = [
    { value: '10,000+', label: 'Students' },
    { value: '500+', label: 'Subjects' },
    { value: '50+', label: 'Institutions' },
    { value: '99.9%', label: 'Uptime' },
  ]
  const values = [
    { title: 'Academic Excellence', desc: 'We believe technology should enhance learning, not complicate it. Every feature is designed with students and educators in mind.' },
    { title: 'Innovation', desc: 'AI-powered insights, smart scheduling, and real-time analytics — we push the boundaries of what an academic platform can do.' },
    { title: 'Security & Trust', desc: 'Bank-grade encryption, SOC 2 compliance, and FERPA adherence. Your data is sacred to us.' },
    { title: 'Inclusivity', desc: 'Built for institutions of all sizes, from small colleges to large universities, across Nigeria and beyond.' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <div className="text-center mb-12">
          <span className="section-label">About Us</span>
          <span className="rule-gold" />
          <h1 className="text-display-md mt-3">Empowering Education<br />Through Technology</h1>
          <p className="text-[15px] text-[var(--color-text-muted)] mt-4 max-w-lg mx-auto leading-relaxed">
            Acaedu is an AI-powered academic learning management system built for institutions that demand modern, intelligent, and secure solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
              className="text-center p-5 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)]"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-2xl font-extrabold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-8 rounded-[18px] border border-[var(--color-primary)]/10 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent mb-12 text-center"
          style={{ boxShadow: 'var(--shadow-card)' }}>
          <h2 className="text-xl font-extrabold text-[var(--color-navy)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Our Mission</h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            To provide every institution — from small colleges to large universities — with intelligent, affordable, and beautiful tools that streamline academic management, enhance learning outcomes, and empower educators and students alike.
          </p>
        </motion.div>

        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-[var(--color-navy)] mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease }}
                className="p-5 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)]"
                style={{ boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-[14px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-[var(--color-navy)] mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>The Team</h2>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease }}
            className="p-5 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] flex items-start gap-4 max-w-md mx-auto"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="w-12 h-12 rounded-[12px] bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-primary)] font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>C</span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Chinedu Daniel Ebirim</h3>
              <p className="text-[11px] text-[var(--color-primary)] font-semibold uppercase tracking-wider">Founder & CEO</p>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-1 leading-relaxed">Building the future of academic management through technology and innovation.</p>
            </div>
          </motion.div>
        </div>

        <p className="text-[var(--color-text-muted)] text-[11px] text-center">© 2026 Acaedu. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const address = 'Lekki, Lagos, Nigeria'
  const lat = 6.4456
  const lng = 3.4723

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) { setError('Please fill in all fields.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    setSending(true); setError('')
    try {
      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h2 style="color:#c1272d;font-size:1.5rem;text-align:center">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1.5rem">
            <tr><td style="padding:8px 0;color:#555;width:100px;font-weight:600">Name:</td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600">Email:</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#025e6b">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600">Subject:</td><td style="padding:8px 0">${subject || 'General Inquiry'}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600;vertical-align:top">Message:</td>
              <td style="padding:8px 0;white-space:pre-wrap;line-height:1.6">${message}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e2db;margin:1.5rem 0"/>
          <p style="color:#888;font-size:0.75rem;text-align:center">Sent from acaedu.sbs contact form</p>
        </div>`
      await sendEmail({ to: 'DanielEbirim25@gmail.com', subject: `Contact: ${name} — ${subject || 'General'}`, html })
      setSent(true); setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please email us directly at DanielEbirim25@gmail.com')
    }
    setSending(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <div className="text-center mb-10">
          <span className="section-label">Get in Touch</span>
          <span className="rule-gold" />
          <h1 className="text-display-sm mt-3">Contact Us</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-2 max-w-md mx-auto">
            Have questions? We'd love to hear from you. Reach out via any channel below.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Mail, label: 'Email', value: 'DanielEbirim25@gmail.com', href: 'mailto:DanielEbirim25@gmail.com', color: 'var(--color-primary)' },
            { icon: Phone, label: 'Phone', value: '+234 911 589 9245', href: 'tel:+2349115899245', color: 'var(--color-secondary)' },
            { icon: Globe, label: 'WhatsApp', value: 'Chat Now', href: 'https://wa.me/2349115899245', color: '#25D366' },
            { icon: Clock, label: 'Hours', value: 'Mon-Fri 9AM-6PM', href: '', color: '#b8860b' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="block p-4 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] hover:-translate-y-0.5 transition-all group text-center"
                  style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mx-auto mb-2.5"
                    style={{ background: `color-mix(in srgb, ${c.color} 10%, transparent)` }}>
                    <c.icon size={18} style={{ color: c.color }} />
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{c.label}</div>
                  <div className="text-[12px] font-semibold text-[var(--color-navy)] mt-1 group-hover:text-[var(--color-primary)] transition-colors">{c.value}</div>
                </a>
              ) : (
                <div className="p-4 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-center"
                  style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mx-auto mb-2.5"
                    style={{ background: `color-mix(in srgb, ${c.color} 10%, transparent)` }}>
                    <c.icon size={18} style={{ color: c.color }} />
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{c.label}</div>
                  <div className="text-[12px] font-semibold text-[var(--color-navy)] mt-1">{c.value}</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Google Map */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="p-4 border-b border-[var(--color-border-light)]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <h3 className="text-[14px] font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Our Office</h3>
              </div>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                {address}
                <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5">
                  Open in Maps <ExternalLink size={10} />
                </a>
              </p>
            </div>
            <div className="relative" style={{ height: 280 }}>
              <iframe
                title="Acaedu Office Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnNDQuMiJOIDDCsDI4JzIwLjMiRQ!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng`}
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)]"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-[14px] font-bold text-[var(--color-navy)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Send a Message</h3>
            {sent ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="font-bold text-[var(--color-navy)] mb-1">Message sent!</p>
                <p className="text-[12px] text-[var(--color-text-muted)]">We'll respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-[12px] text-[var(--color-primary)] hover:underline font-semibold">Send another</button>
              </motion.div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                {error && <div className="px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/20 text-red-600 text-[12px]">{error}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                      className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-light)] bg-[var(--color-bg)] text-[13px] outline-none focus:border-[var(--color-primary)] transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                      className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-light)] bg-[var(--color-bg)] text-[13px] outline-none focus:border-[var(--color-primary)] transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-light)] bg-[var(--color-bg)] text-[13px] outline-none focus:border-[var(--color-primary)] transition">
                    <option value="">General Inquiry</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4} placeholder="How can we help?"
                    className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-light)] bg-[var(--color-bg)] text-[13px] outline-none focus:border-[var(--color-primary)] transition resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 rounded-[10px] bg-[var(--color-primary)] text-white font-semibold text-[13px] hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</> : <><Send size={14} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
