export function addDeadlines(posts, baseTime) {
  return posts.map((post) => ({
    ...post,
    deadline: getMockDeadline(post.id, baseTime),
  }));
}

export function getDeadlineState(diffMs) {
  if (diffMs <= 0) {
    return "over";
  }

  const hours = diffMs / (1000 * 60 * 60);

  if (hours < 3) {
    return "urgent";
  }

  if (hours < 24) {
    return "soon";
  }

  return "normal";
}

export function formatCountdown(diffMs) {
  if (diffMs <= 0) {
    return "마감";
  }

  const pad = (number) => String(number).padStart(2, "0");
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return days > 0 ? `${days}일 ${clock}` : clock;
}

function getMockDeadline(id, baseTime) {
  const hoursLeft = ((id * 13) % 60) - 12;

  return baseTime + hoursLeft * 60 * 60 * 1000;
}