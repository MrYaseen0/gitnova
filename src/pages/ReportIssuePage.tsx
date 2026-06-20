import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Send, CheckCircle2, Bug, MessageSquareWarning, Shield, Lightbulb } from 'lucide-react';
import Header from '../components/Header';
import { achievementsApi } from '../lib/api';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const reportTypes = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: '#EF4444', description: 'Something is broken or not working as expected' },
  { value: 'complaint', label: 'Complaint', icon: MessageSquareWarning, color: '#F59E0B', description: 'Dissatisfied with an experience or feature' },
  { value: 'security', label: 'Security Issue', icon: Shield, color: '#8B5CF6', description: 'Found a vulnerability or privacy concern' },
  { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: '#2D6A4F', description: 'Idea for improvement or new feature' },
];

const priorityLevels = [
  { value: 'low', label: 'Low', color: '#6B7280' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'critical', label: 'Critical', color: '#DC2626' },
];

const recentIssues = [
  { id: '#1042', title: 'Terminal not accepting input on mobile', type: 'bug', status: 'open', date: '2 hours ago', replies: 3 },
  { id: '#1038', title: 'Dark mode contrast issues in Playground', type: 'bug', status: 'in-progress', date: '1 day ago', replies: 5 },
  { id: '#1035', title: 'Request: Add Java levels', type: 'suggestion', status: 'open', date: '2 days ago', replies: 8 },
  { id: '#1031', title: 'Progress reset after browser update', type: 'complaint', status: 'resolved', date: '4 days ago', replies: 2 },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: 'rgba(45,106,79,0.1)', text: '#2D6A4F', label: 'Open' },
  'in-progress': { bg: 'rgba(245,158,11,0.1)', text: '#D97706', label: 'In Progress' },
  resolved: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Resolved' },
};

export default function ReportIssuePage() {
  const [form, setForm] = useState({ name: '', email: '', type: '', priority: 'medium', title: '', description: '', steps: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.type) errs.type = 'Please select a report type';
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await achievementsApi.report({
        type: form.type,
        title: form.title,
        description: `[${form.name}] [${form.email}] [${form.priority}] ${form.description}\nSteps: ${form.steps}`,
        page: window.location.pathname,
      });
    } catch { /* best effort */ }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', type: '', priority: 'medium', title: '', description: '', steps: '' }); }, 5000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E8E4DD',
    fontSize: 14, fontFamily: 'Inter', background: '#FAFAF8', outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#2D6A4F';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.1)';
  };

  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? '#EF4444' : '#E8E4DD';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Header />
      <div style={{ paddingTop: 80 }} />

      {/* Hero */}
      <section style={{ padding: '3rem 2rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(239,68,68,0.06), transparent)', borderRadius: '50%' }} />
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1))', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 9999, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 20 }}>
            <AlertTriangle size={14} /> Report an Issue
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontFamily: 'Sora', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
            Report a{' '}
            <span style={{ background: 'linear-gradient(135deg, #EF4444, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Problem
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 17, color: '#6B7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Found a bug, have a complaint, or want to suggest an improvement? Let us know and we'll address it promptly.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '0 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {/* Report Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: '1 1 450px', background: '#fff', border: '1px solid #E8E4DD', borderRadius: 24, padding: 36 }}
          >
            <h2 style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Submit a Report</h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Fill out the form below with as much detail as possible.</p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '48px 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                  >
                    <CheckCircle2 size={36} color="#fff" />
                  </motion.div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Report Submitted!</h3>
                  <p style={{ color: '#6B7280', fontSize: 14 }}>Thank you for your report. We'll investigate and get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Report Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Report Type *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {reportTypes.map((t) => (
                        <motion.button
                          key={t.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, type: t.value })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                            borderRadius: 12, border: form.type === t.value ? `2px solid ${t.color}` : '1.5px solid #E8E4DD',
                            background: form.type === t.value ? `${t.color}08` : '#FAFAF8',
                            cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                          }}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <t.icon size={16} color={t.color} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{t.label}</div>
                            <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>{t.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {errors.type && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.type}</span>}
                  </div>

                  {/* Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="report-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Your Name *</label>
                      <input id="report-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe"
                        style={{ ...inputStyle, border: errors.name ? '1.5px solid #EF4444' : inputStyle.border }}
                        onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors.name)} />
                      {errors.name && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.name}</span>}
                    </div>
                    <div>
                      <label htmlFor="report-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Email *</label>
                      <input id="report-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com"
                        style={{ ...inputStyle, border: errors.email ? '1.5px solid #EF4444' : inputStyle.border }}
                        onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors.email)} />
                      {errors.email && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.email}</span>}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Priority</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {priorityLevels.map((p) => (
                        <motion.button
                          key={p.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setForm({ ...form, priority: p.value })}
                          style={{
                            flex: 1, padding: '8px 12px', borderRadius: 10,
                            border: form.priority === p.value ? `2px solid ${p.color}` : '1.5px solid #E8E4DD',
                            background: form.priority === p.value ? `${p.color}10` : '#FAFAF8',
                            fontSize: 13, fontWeight: 600, color: form.priority === p.value ? p.color : '#6B7280',
                            cursor: 'pointer', transition: 'all .2s',
                          }}
                        >
                          {p.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="report-title" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Title *</label>
                    <input id="report-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief summary of the issue"
                      style={{ ...inputStyle, border: errors.title ? '1.5px solid #EF4444' : inputStyle.border }}
                      onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors.title)} />
                    {errors.title && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.title}</span>}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="report-description" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Description *</label>
                    <textarea id="report-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                      placeholder="Provide detailed information about the issue. What happened? What did you expect?"
                      style={{ ...inputStyle, resize: 'vertical', border: errors.description ? '1.5px solid #EF4444' : inputStyle.border }}
                      onFocus={focusStyle} onBlur={(e) => blurStyle(e, !!errors.description)} />
                    {errors.description && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{errors.description}</span>}
                  </div>

                  {/* Steps to Reproduce */}
                  <div>
                    <label htmlFor="report-steps" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>Steps to Reproduce (optional)</label>
                    <textarea id="report-steps" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} rows={3}
                      placeholder="1. Go to... 2. Click on... 3. See error..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={focusStyle} onBlur={(e) => blurStyle(e)} />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '14px 28px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
                      color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
                      border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.25)',
                    }}
                  >
                    <Send size={16} /> Submit Report
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: '1 1 350px' }}
          >
            {/* Recent Issues */}
            <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 24, padding: 32, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Reports</h3>
              {recentIssues.map((issue, i) => {
                const status = statusColors[issue.status];
                return (
                  <div key={i} style={{ borderBottom: i < recentIssues.length - 1 ? '1px solid #F0EEE9' : 'none', paddingBottom: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#2D6A4F', fontFamily: 'JetBrains Mono' }}>{issue.id}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: status.text, background: status.bg, padding: '2px 8px', borderRadius: 6 }}>
                        {status.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px', lineHeight: 1.4 }}>{issue.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#9CA3AF' }}>
                      <span>{issue.date}</span>
                      <span>{issue.replies} replies</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guidelines */}
            <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 24, padding: 32 }}>
              <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Reporting Guidelines</h3>
              {[
                { title: 'Be Specific', desc: 'Provide clear details about what went wrong and where.' },
                { title: 'Include Screenshots', desc: 'Visual evidence helps us diagnose issues faster.' },
                { title: 'Check Existing Reports', desc: 'Avoid duplicates by checking recent reports first.' },
                { title: 'One Issue Per Report', desc: 'Submit separate reports for unrelated issues.' },
              ].map((g, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{g.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
