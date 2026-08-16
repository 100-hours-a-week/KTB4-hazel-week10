import Skeleton, { SkeletonGroup, SkeletonText } from "./index.jsx";

const DEFAULT_FIELD_HEIGHTS = [44, 44, 44];
const DEFAULT_GAP = 16;

function FormSkeleton({
  hasAvatar = false,
  hasDescription = false,
  fieldHeights = DEFAULT_FIELD_HEIGHTS,
  gap = DEFAULT_GAP,
  hasButton = true,
  label = "불러오는 중입니다.",
}) {
  return (
    <SkeletonGroup className="form-skeleton" label={label} style={{ rowGap: gap }}>
      {hasAvatar && (
        <div className="form-skeleton__avatar-field">
          <SkeletonText width={88} barHeight={12} className="form-skeleton__avatar-label" />
          <Skeleton width={120} height={120} circle className="form-skeleton__avatar" />
        </div>
      )}

      {hasDescription && (
        <div className="form-skeleton__description">
          <SkeletonText barHeight={12} />
          <SkeletonText width="62%" barHeight={12} />
        </div>
      )}

      {fieldHeights.map((height, index) => (
        <div className="form-skeleton__field" key={index}>
          <SkeletonText width={88} barHeight={12} />
          <Skeleton height={height} radius="var(--radius-sm)" />
        </div>
      ))}

      {hasButton && (
        <Skeleton height={44} radius="var(--radius-sm)" className="form-skeleton__button" />
      )}
    </SkeletonGroup>
  );
}

export default FormSkeleton;
