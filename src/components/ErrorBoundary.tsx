import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF8',
          fontFamily: 'Inter, sans-serif',
          padding: 24,
        }}>
          <div style={{
            maxWidth: 440,
            textAlign: 'center',
            background: '#fff',
            borderRadius: 24,
            padding: '48px 40px',
            border: '1px solid #E8E4DD',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <AlertTriangle size={32} color="#EF4444" />
            </div>
            <h2 style={{
              fontFamily: 'Sora',
              fontSize: 22,
              fontWeight: 800,
              color: '#1A1A1A',
              margin: '0 0 8px',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontSize: 14,
              color: '#6B7280',
              margin: '0 0 24px',
              lineHeight: 1.6,
            }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Inter',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
              }}
            >
              <RefreshCw size={16} /> Refresh Page
            </button>
            {this.state.error && (
              <details style={{ marginTop: 24, textAlign: 'left' }}>
                <summary style={{ fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>
                  Error details
                </summary>
                <pre style={{
                  fontSize: 11,
                  color: '#EF4444',
                  background: '#FEF2F2',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
