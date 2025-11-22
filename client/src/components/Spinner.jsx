export default function Spinner({ size = 24 }) {
  return (
    <span
      role="status"
      aria-label="loading"
      style={{ width: size, height: size, display: "inline-block" }}
      className="rounded-full border-2 border-t-transparent border-slate-500"
    >
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(204,78,0,0.98)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="10"
        />
      </svg>
    </span>
  );
}
