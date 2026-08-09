import Skeleton, { SkeletonGroup } from "./index.jsx";

const DEFAULT_FIELD_HEIGHTS = [44, 44, 44];

/**
 * 라벨 + 입력 필드가 반복되는 설정·수정 폼의 로딩 자리표시자다.
 * fieldHeights로 각 필드의 높이를 지정해 실제 폼 높이에 맞춘다.
 */
function FormSkeleton({
  hasAvatar = false,
  fieldHeights = DEFAULT_FIELD_HEIGHTS,
  hasButton = true,
  label = "불러오는 중입니다.",
}) {
  return (
    <SkeletonGroup className="form-skeleton" label={label}>
      {hasAvatar && (
        <Skeleton width={120} height={120} circle className="form-skeleton__avatar" />
      )}

      {fieldHeights.map((height, index) => (
        <div className="form-skeleton__field" key={index}>
          <Skeleton width={88} height={12} />
          <Skeleton height={height} radius="var(--radius-sm)" />
        </div>
      ))}

      {hasButton && <Skeleton height={44} radius="var(--radius-sm)" className="form-skeleton__button" />}
    </SkeletonGroup>
  );
}

export default FormSkeleton;
