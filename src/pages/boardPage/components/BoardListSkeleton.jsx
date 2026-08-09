import Skeleton, { SkeletonGroup, SkeletonText } from "@/components/skeleton/index.jsx";

const DEFAULT_ITEM_COUNT = 5;

/**
 * PostItem과 같은 구조·클래스를 써서 로딩이 끝나도 카드 높이가 변하지 않는다.
 */
function PostItemSkeleton() {
  return (
    <div className="item item--skeleton">
      <div className="item__top">
        <div className="item__title-row">
          <Skeleton width={64} height={22} />
          <Skeleton width={22} height={22} circle />

          <div className="item__title-lines">
            <SkeletonText barHeight={14} />
            <SkeletonText width="58%" barHeight={14} />
          </div>
        </div>

        <div className="item__vote">
          <Skeleton width={74} height={26.5} radius="var(--radius-md)" />
          <Skeleton width={74} height={26.5} radius="var(--radius-md)" />
        </div>
      </div>

      <div className="count-container">
        <div className="count-container__list">
          <SkeletonText className="count__text" width={228} barHeight={13} />
        </div>

        <SkeletonText className="count__text" width={92} barHeight={13} />
      </div>

      <div className="line__item" />

      <div className="profile-container">
        <Skeleton width={32} height={32} circle />
        <Skeleton width={96} height={14} />
      </div>
    </div>
  );
}

function BoardListSkeleton({ count = DEFAULT_ITEM_COUNT, label = "질문 목록을 불러오는 중입니다." }) {
  return (
    <SkeletonGroup className="board-skeleton" label={label}>
      {Array.from({ length: count }, (_, index) => (
        <PostItemSkeleton key={index} />
      ))}
    </SkeletonGroup>
  );
}

export default BoardListSkeleton;
