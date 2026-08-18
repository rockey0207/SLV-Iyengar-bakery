const FALLBACK = "/bakery-icon-logo.png";

export default function SafeImage({ src, alt, className, loading = "lazy" }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        if (e.currentTarget.src !== window.location.origin + FALLBACK) {
          e.currentTarget.src = FALLBACK;
        }
      }}
    />
  );
}
