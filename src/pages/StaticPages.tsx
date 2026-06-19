import { motion } from 'framer-motion'

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-extrabold text-navy mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Terms of Service</h1>
        <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using Acaedu (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must provide accurate and complete information during registration.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">3. Acceptable Use</h2>
            <p>You agree to use the Platform only for lawful academic purposes. You shall not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Share false or misleading information</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
              <li>Use the Platform for commercial purposes without authorization</li>
              <li>Upload malicious content or spam</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">4. Intellectual Property</h2>
            <p>All content on the Platform, including text, graphics, logos, and software, is the property of Acaedu and is protected by copyright laws.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">5. Limitation of Liability</h2>
            <p>Acaedu shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Platform constitutes acceptance of the modified terms.</p>
          </section>
          <p className="text-text-muted text-xs mt-8">Last updated: January 2026</p>
        </div>
      </motion.div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-extrabold text-navy mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email, and contact information</li>
              <li>Academic records and course enrollments</li>
              <li>Usage data and interaction logs</li>
              <li>Payment information (processed securely by Paystack/PayPal)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and improve the Platform</li>
              <li>Send academic notifications and announcements</li>
              <li>Process payments and subscriptions</li>
              <li>Generate analytics and reports</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">4. Third-Party Services</h2>
            <p>We use Supabase for authentication and database, Resend for email delivery, and Paystack/PayPal for payments. These services have their own privacy policies.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy mb-2">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
          </section>
          <p className="text-text-muted text-xs mt-8">Last updated: January 2026</p>
        </div>
      </motion.div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-extrabold text-navy mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl bg-white border border-beige hover:border-navy/20 transition-colors">
            <h3 className="font-bold text-navy mb-2 text-sm">Email</h3>
            <a href="mailto:support@acaedu.sbs" className="text-sm text-accent hover:underline">support@acaedu.sbs</a>
          </div>
          <div className="p-5 rounded-xl bg-white border border-beige hover:border-navy/20 transition-colors">
            <h3 className="font-bold text-navy mb-2 text-sm">Phone</h3>
            <a href="tel:+2349115899245" className="text-sm text-accent hover:underline">+234 911 589 9245</a>
          </div>
          <div className="p-5 rounded-xl bg-white border border-beige hover:border-navy/20 transition-colors">
            <h3 className="font-bold text-navy mb-2 text-sm">WhatsApp</h3>
            <a href="https://wa.me/2349115899245" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Chat on WhatsApp</a>
          </div>
          <div className="p-5 rounded-xl bg-white border border-beige hover:border-navy/20 transition-colors">
            <h3 className="font-bold text-navy mb-2 text-sm">Location</h3>
            <p className="text-sm text-text-muted">Nigeria</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-beige">
          <h3 className="font-bold text-navy mb-4 text-sm">Send us a message</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent!') }}>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Name</label>
              <input className="w-full px-4 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="Your name"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="you@example.com"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Message</label>
              <textarea className="w-full px-4 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition resize-none" rows={4} placeholder="Your message..."/>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-all shadow-sm">Send Message</button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
