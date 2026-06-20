import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { TRACK_INFO } from '../data/levels';
import type { Language } from '../types';

interface CertificateProps {
  language: Language;
  style?: React.CSSProperties;
}

interface CertificateData {
  id: string;
  userName: string;
  language: string;
  trackName: string;
  completedLevels: number;
  totalXp: number;
  completionDate: string;
  verificationUrl: string;
}

function generateCertificateId(userId: string, language: string): string {
  const timestamp = Date.now().toString(36);
  const hash = userId.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  return `GN-${language.toUpperCase()}-${timestamp}-${Math.abs(hash).toString(36).toUpperCase()}`;
}

function generateVerificationUrl(certificateId: string): string {
  return `https://gitnova.me/verify/${certificateId}`;
}

export default function Certificate({ language, style }: CertificateProps) {
  const user = useAuthStore(s => s.user);

  const certificateData = useMemo((): CertificateData | null => {
    if (!user) return null;

    const completedLevels = (user.completedLevels[language] || []).length;
    const totalLevels = language === 'git' ? 50 : 10;
    const trackInfo = TRACK_INFO[language];

    if (completedLevels < totalLevels) return null; // Not eligible

    const certificateId = generateCertificateId(user.id, language);
    return {
      id: certificateId,
      userName: user.name,
      language,
      trackName: trackInfo.name,
      completedLevels,
      totalXp: completedLevels * 100, // Approximate
      completionDate: new Date().toISOString(),
      verificationUrl: generateVerificationUrl(certificateId),
    };
  }, [user, language]);

  if (!certificateData) {
    const completedLevels = user ? (user.completedLevels[language] || []).length : 0;
    const totalLevels = language === 'git' ? 50 : 10;
    const progress = Math.round((completedLevels / totalLevels) * 100);

    return (
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E8E4DD',
        padding: 32,
        textAlign: 'center',
        ...style,
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: '#F0EEE9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Award size={36} color="#D1D5DB" />
        </div>
        <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#1A1A1A' }}>
          Certificate Locked
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px', lineHeight: 1.6 }}>
          Complete all {totalLevels} {TRACK_INFO[language].name} levels to unlock your certificate.
        </p>
        <div style={{ maxWidth: 300, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>{completedLevels}/{totalLevels} levels</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2D6A4F' }}>{progress}%</span>
          </div>
          <div style={{ background: '#F0EEE9', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #2D6A4F, #52B788)', borderRadius: 9999 }}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // Create certificate image using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#2D6A4F';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border
    ctx.strokeStyle = '#52B788';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Header
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 48px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 120);

    // GitNova logo text
    ctx.fillStyle = '#2D6A4F';
    ctx.font = 'bold 32px Sora, sans-serif';
    ctx.fillText('GitNova', canvas.width / 2, 170);

    // Divider line
    ctx.strokeStyle = '#E8E4DD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(canvas.width - 200, 200);
    ctx.stroke();

    // Award text
    ctx.fillStyle = '#6B7280';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('This certifies that', canvas.width / 2, 260);

    // User name
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 56px Sora, sans-serif';
    ctx.fillText(certificateData.userName, canvas.width / 2, 340);

    // Has successfully completed
    ctx.fillStyle = '#6B7280';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('has successfully completed', canvas.width / 2, 400);

    // Track name
    ctx.fillStyle = '#2D6A4F';
    ctx.font = 'bold 40px Sora, sans-serif';
    ctx.fillText(`${certificateData.trackName} Track`, canvas.width / 2, 470);

    // Level count
    ctx.fillStyle = '#6B7280';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`Completed ${certificateData.completedLevels} levels with ${certificateData.totalXp} XP earned`, canvas.width / 2, 520);

    // Date
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(`Completed on ${new Date(certificateData.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, canvas.width / 2, 580);

    // Certificate ID
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px JetBrains Mono, monospace';
    ctx.fillText(`Certificate ID: ${certificateData.id}`, canvas.width / 2, 640);

    // Verification URL
    ctx.fillStyle = '#2D6A4F';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Verify at: ${certificateData.verificationUrl}`, canvas.width / 2, 680);

    // Footer line
    ctx.strokeStyle = '#E8E4DD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 720);
    ctx.lineTo(canvas.width - 200, 720);
    ctx.stroke();

    // GitNova branding
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('GitNova - Master Git Through Play | gitnova.me', canvas.width / 2, 760);

    // Download
    const link = document.createElement('a');
    link.download = `gitnova-certificate-${certificateData.trackName.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    const shareUrl = certificateData.verificationUrl;
    const shareText = `I just completed the ${certificateData.trackName} Track on GitNova! 🎉\n\n${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${certificateData.trackName} Certificate - GitNova`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>GitNova Certificate - ${certificateData.trackName}</title>
      <style>
        @page { size: landscape; margin: 0; }
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
        .cert { width: 900px; padding: 48px; border: 3px solid #2D6A4F; text-align: center; position: relative; }
        .corner { position: absolute; width: 40px; height: 40px; }
        .corner.tl { top: 12px; left: 12px; border-top: 3px solid #52B788; border-left: 3px solid #52B788; }
        .corner.tr { top: 12px; right: 12px; border-top: 3px solid #52B788; border-right: 3px solid #52B788; }
        .corner.bl { bottom: 12px; left: 12px; border-bottom: 3px solid #52B788; border-left: 3px solid #52B788; }
        .corner.br { bottom: 12px; right: 12px; border-bottom: 3px solid #52B788; border-right: 3px solid #52B788; }
        h1 { font-family: Sora, sans-serif; font-size: 36px; color: #1A1A1A; margin: 0 0 8px; }
        .brand { font-family: Sora, sans-serif; font-size: 24px; color: #2D6A4F; font-weight: 700; margin: 0 0 16px; }
        .divider { width: 200px; height: 1px; background: #E8E4DD; margin: 0 auto 16px; }
        .label { font-size: 14px; color: #6B7280; margin: 4px 0; }
        .name { font-family: Sora, sans-serif; font-size: 28px; font-weight: 700; color: #1A1A1A; margin: 8px 0; }
        .track { font-family: Sora, sans-serif; font-size: 20px; font-weight: 700; color: #2D6A4F; margin: 8px 0; }
        .stats { font-size: 13px; color: #9CA3AF; margin: 8px 0; }
        .id { font-size: 11px; color: #9CA3AF; margin-top: 16px; }
        .footer { font-size: 12px; color: #9CA3AF; margin-top: 24px; }
      </style></head><body>
      <div class="cert">
        <div class="corner tl"></div><div class="corner tr"></div>
        <div class="corner bl"></div><div class="corner br"></div>
        <h1>Certificate of Completion</h1>
        <div class="brand">GitNova</div>
        <div class="divider"></div>
        <div class="label">This certifies that</div>
        <div class="name">${certificateData.userName}</div>
        <div class="label">has successfully completed</div>
        <div class="track">${certificateData.trackName} Track</div>
        <div class="stats">${certificateData.completedLevels} levels · ${certificateData.totalXp} XP</div>
        <div class="stats">Completed on ${new Date(certificateData.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div class="id">Certificate ID: ${certificateData.id}</div>
        <div class="footer">GitNova - Master Git Through Play | gitnova.me</div>
      </div>
      <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(certificateData.verificationUrl);
    const text = encodeURIComponent(`I just completed the ${certificateData.trackName} Track on GitNova! 🎉`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`I just completed the ${certificateData.trackName} Track on GitNova! 🎉 ${certificateData.verificationUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #E8E4DD',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Certificate preview */}
      <div style={{
        padding: 32,
        background: 'linear-gradient(135deg, #F8F8F6, #fff)',
        borderBottom: '1px solid #E8E4DD',
      }}>
        <div style={{
          border: '3px solid #2D6A4F',
          borderRadius: 16,
          padding: '40px 32px',
          textAlign: 'center',
          position: 'relative',
          background: '#fff',
        }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderTop: '3px solid #52B788', borderLeft: '3px solid #52B788' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderTop: '3px solid #52B788', borderRight: '3px solid #52B788' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 40, height: 40, borderBottom: '3px solid #52B788', borderLeft: '3px solid #52B788' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderBottom: '3px solid #52B788', borderRight: '3px solid #52B788' }} />

          <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Certificate of Completion</div>
          <div style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, color: '#2D6A4F', marginBottom: 16 }}>GitNova</div>
          
          <div style={{ width: 60, height: 1, background: '#E8E4DD', margin: '0 auto 16px' }} />
          
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>This certifies that</div>
          <div style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
            {certificateData.userName}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>has successfully completed</div>
          <div style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, color: '#2D6A4F', marginBottom: 12 }}>
            {certificateData.trackName} Track
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>
            {certificateData.completedLevels} levels · {certificateData.totalXp} XP
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
            ID: {certificateData.id}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: 20, display: 'flex', gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Download size={16} /> Download PNG
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrintPdf}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            background: '#fff',
            border: '1px solid #E8E4DD',
            borderRadius: 12,
            color: '#374151',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={16} /> PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            background: '#fff',
            border: '1px solid #E8E4DD',
            borderRadius: 12,
            color: '#374151',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Share2 size={16} /> Share
        </motion.button>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareLinkedIn}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 16px', background: '#0A66C2', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          LinkedIn
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareTwitter}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 16px', background: '#1DA1F2', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Twitter / X
        </motion.button>
      </div>

      {/* Verification info */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #E8E4DD',
        background: '#F8F8F6',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: '#6B7280',
      }}>
        <CheckCircle2 size={14} color="#2D6A4F" />
        <span>This certificate can be verified at <strong>{certificateData.verificationUrl}</strong></span>
      </div>
    </div>
  );
}

// Certificate gallery for all tracks
export function CertificateGallery() {
  const user = useAuthStore(s => s.user);
  const languages: Language[] = ['git', 'python', 'c', 'cpp', 'java'];

  const certificates = useMemo(() => {
    if (!user) return [];
    return languages.map(lang => {
      const completedLevels = (user.completedLevels[lang] || []).length;
      const totalLevels = lang === 'git' ? 50 : 10;
      return {
        language: lang,
        completed: completedLevels,
        total: totalLevels,
        isComplete: completedLevels >= totalLevels,
      };
    });
  }, [user, languages]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
      {certificates.map(cert => (
        <Certificate key={cert.language} language={cert.language} />
      ))}
    </div>
  );
}
