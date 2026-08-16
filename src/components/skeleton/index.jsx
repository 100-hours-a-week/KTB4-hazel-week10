import "./index.css";

function Skeleton({ width, height, radius, circle = false, className = "" }) {
  const skeletonClassName = ["skeleton", circle ? "skeleton--circle" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={skeletonClassName}
      style={{ width, height, borderRadius: circle ? "50%" : radius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ width, lineHeight, barHeight = 12, className = "" }) {
  return (
    <span
      className={`skeleton-text ${className}`.trim()}
      style={lineHeight ? { height: lineHeight } : undefined}
    >
      <Skeleton width={width} height={barHeight} />
    </span>
  );
}

export function SkeletonGroup({ label, className = "", style, children }) {
  return (
    <div
      className={`skeleton-group ${className}`.trim()}
      role="status"
      aria-busy="true"
      aria-label={label}
      style={style}
    >
      {children}
    </div>
  );
}

export default Skeleton;
