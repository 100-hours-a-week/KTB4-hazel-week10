import "./index.css";

/**
 * 로딩 중 자리를 대신 채우는 회색 블록이다.
 * 내용이 없으므로 보조 기기에는 숨기고, 상태 안내는 SkeletonGroup이 담당한다.
 */
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

/**
 * 텍스트 한 줄이 차지하는 높이를 그대로 유지하는 자리표시자다.
 * 실제 텍스트에 쓰는 클래스를 그대로 넘기면 줄 높이(1lh)를 물려받아,
 * 로딩이 끝나 실제 내용으로 바뀔 때 화면이 밀리지 않는다.
 */
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

/**
 * 스켈레톤 묶음을 감싸 로딩 상태를 한 번만 안내한다.
 */
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
