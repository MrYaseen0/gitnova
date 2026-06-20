export default function PlausibleAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'gitnova.dev';
  return (
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
