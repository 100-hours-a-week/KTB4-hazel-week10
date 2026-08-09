import Skeleton, { SkeletonGroup, SkeletonText } from "@/components/skeleton/index.jsx";

const DEFAULT_COMMENT_COUNT = 3;

/**
 * CommentItem과 같은 구조·클래스를 써서 댓글이 도착해도 목록이 밀리지 않는다.
 */
function CommentItemSkeleton() {
  return (
    <div className="comment-item comment-item--skeleton">
      <Skeleton width={40} height={40} circle />

      <div className="comment-item__content">
        <div className="comment-item__meta">
          <SkeletonText className="comment-item__author" width={84} barHeight={13} />
          <SkeletonText className="comment-item__date" width={64} barHeight={11} />
        </div>

        <p className="comment-item__text">
          <SkeletonText width="72%" barHeight={14} />
        </p>
      </div>
    </div>
  );
}

function BoardDetailSkeleton({ commentCount = DEFAULT_COMMENT_COUNT }) {
  return (
    <SkeletonGroup className="detail-skeleton" label="질문을 불러오는 중입니다.">
      <div className="detail__card">
        <Skeleton width={78} height={24} className="detail-skeleton__category" />

        <h2 className="detail__title">
          <SkeletonText width="64%" barHeight={20} />
        </h2>

        <div className="detail__meta">
          <div className="detail__mate-container">
            <div className="profile-container">
              <Skeleton width={36} height={36} circle />
              <SkeletonText className="profile__name" width={92} barHeight={14} />
            </div>

            <SkeletonText className="detail__date" width={72} barHeight={12} />
          </div>
        </div>

        <div className="line" />

        <p className="detail__content">
          <SkeletonText barHeight={14} />
          <SkeletonText barHeight={14} />
          <SkeletonText width="86%" barHeight={14} />
          <SkeletonText width="45%" barHeight={14} />
        </p>

        <div className="detail__count-container">
          <Skeleton width={116} height={68} radius="var(--radius-md)" />
          <Skeleton width={116} height={68} radius="var(--radius-md)" />
          <Skeleton width={116} height={68} radius="var(--radius-md)" />
        </div>

        <div className="detail__vote-container">
          <Skeleton width={116} height={40} radius="var(--radius-md)" />
          <Skeleton width={116} height={40} radius="var(--radius-md)" />
        </div>
      </div>

      <div className="comment-list">
        {Array.from({ length: commentCount }, (_, index) => (
          <CommentItemSkeleton key={index} />
        ))}
      </div>
    </SkeletonGroup>
  );
}

export default BoardDetailSkeleton;
