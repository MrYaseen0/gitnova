import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import AboutSection3 from '../components/ui/about-section';
import { achievementsApi } from '../lib/api';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'yaseenahmad13579@gmail.com', href: 'mailto:yaseenahmad13579@gmail.com', color: '#2D6A4F' },
  { icon: MapPin, label: 'Location', value: 'Peshawar, Pakistan', href: 'https://maps.google.com/?q=Peshawar,Pakistan', color: '#F4845F' },
  { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: '#faq', color: '#E9C46A' },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yaseen-ahmad-489967280?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    color: '#0A66C2',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/MrYaseen0',
    svg: <svg viewBox="0 0 438.549 438.549" width="20" height="20" fill="currentColor"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.409 14.842 40.576v49.993c0 3.427 1.181 6.279 3.548 8.562 2.369 2.279 6.136 2.948 11.292 1.995 44.163-14.653 80.185-41.062 108.068-79.227 27.88-38.161 41.825-81.126 41.825-128.906 0-39.78-9.804-76.454-29.408-110.049z"/></svg>,
    color: '#333',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/yaseenahmadexe?igsh=MXFlZHNvbDdwNGQw',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    color: '#E4405F',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1BsjieEv7e/',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    color: '#1877F2',
  },
];

const faqItems = [
  { q: 'What technologies do you work with?', a: 'I specialize in the MERN stack (MongoDB, Express.js, React, Node.js), Python for AI/ML solutions, and have deep expertise in Git, DevOps, and cloud-native architectures. I also work with TypeScript, Next.js, and modern frontend frameworks.' },
  { q: 'Are you available for freelance work?', a: 'Yes! I\'m open to freelance projects, consulting, and collaboration opportunities. Whether you need a full-stack web application, an AI-powered solution, or help with DevOps — let\'s talk.' },
  { q: 'How can I collaborate with you?', a: 'You can reach out via LinkedIn, email, or the contact form below. I\'m always interested in meaningful projects, open-source contributions, and knowledge sharing within the developer community.' },
  { q: 'What is GitNova?', a: 'GitNova is my flagship project — a gamified learning platform that makes Git, GitHub, and programming accessible to everyone through interactive lessons, a browser-based terminal, and achievement-driven progress tracking.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await achievementsApi.report({
        type: 'contact',
        title: form.subject,
        description: `[${form.name}] [${form.email}] ${form.message}`,
        page: window.location.pathname,
      });
    } catch { /* best effort */ }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }, 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E8E4DD',
    fontSize: 14, fontFamily: 'Inter', background: '#FAFAF8', outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#2D6A4F';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.1)';
  };

  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? '#EF4444' : '#E8E4DD';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Header />
      <div style={{ paddingTop: 80 }} />

      {/* Hero */}
      <section style={{ padding: '4rem 2rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(45,106,79,0.06), transparent)', borderRadius: '50%' }} />
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(82,183,136,0.1))', border: '1px solid rgba(45,106,79,0.15)', borderRadius: 9999, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#2D6A4F', marginBottom: 20 }}>
            <MessageSquare size={14} /> Get in Touch
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontFamily: 'Sora', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
            Let's Build{' '}
            <span style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Something Great
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 17, color: '#6B7280', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Software Engineer passionate about building scalable web applications and AI solutions. Let's connect and create something impactful together.
          </motion.p>
        </motion.div>
      </section>

      {/* About Section - Animated Profile */}
      <AboutSection3 />

      {/* Contact Methods */}
      <section style={{ padding: '0 2rem 3rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {contactMethods.map((c, i) => (
            <motion.a
              key={i}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(45,106,79,0.12)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
                background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16,
                textDecoration: 'none', color: 'inherit', transition: 'all .2s',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={22} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{c.value}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Main Content: Form + FAQ */}
      <section style={{ padding: '0 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: '1 1 400px', background: '#fff', border: '1px solid #E8E4DD', borderRadius: 24, padding: 36 }}
          >
            <h2 style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Send a Message</h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Have a project in mind or want to collaborate? Drop me a message.</p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle2 size={36} color="#fff" />
                  </motion.div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: '#6B7280', fontSize: 14 }}>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { key: 'name', label: 'Your Name', placeholder: 'John Doe', type: 'text' },
                    { key: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email' },
                    { key: 'subject', label: 'Subject', placeholder: 'Project collaboration, bug report...', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label htmlFor={`contact-${field.key}`} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>{field.label}</label>
                      <input id={`contact-${field.key}`} type={field.type} value={(form as Record<string, string>)[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder}
                        style={{ ...inputStyle, border: errors[field.key] ? '1.5px solid #EF4444' : inputStyle.border }}
                        onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors[field.key])} />
                      {errors[field.key] && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors[field.key]}</span>}
                    </div>
                  ))}
                  <div>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Message</label>
                    <textarea id="contact-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or idea..." rows={5}
                      style={{ ...inputStyle, resize: 'vertical', border: errors.message ? '1.5px solid #EF4444' : inputStyle.border }}
                      onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors.message)} />
                    {errors.message && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.message}</span>}
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}>
                    <Send size={16} /> Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FAQ + Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ flex: '1 1 350px' }}>
            {/* FAQ */}
            <div id="faq" style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 24, padding: 32, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Frequently Asked</h3>
              {faqItems.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqItems.length - 1 ? '1px solid #F0EEE9' : 'none', paddingBottom: 16, marginBottom: 16 }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', fontFamily: 'Inter' }}>{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ fontSize: 20, color: '#6B7280', flexShrink: 0, marginLeft: 8 }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginTop: 10 }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Built by Yaseen */}
            <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D6A4F 50%, #52B788)', borderRadius: 24, padding: 32, color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'Sora', backdropFilter: 'blur(8px)' }}>YA</div>
                <div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, margin: 0 }}>Built by Yaseen</h3>
                  <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>Software Engineer · Maker of GitNova</p>
                </div>
              </div>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7, marginBottom: 20 }}>Building tools that empower developers to learn, grow, and ship with confidence. Always open to new ideas and collaborations.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {socialLinks.map((s, i) => (
                  <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }}
                    style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                    {s.svg}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
