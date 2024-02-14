const CalculateTimeAgo = (createdAt: string) => {
  const now = new Date(); // 현재 시간
  const created = new Date(createdAt); // createdAt을 Date 객체로 변환
  const diff = now.getTime() - created.getTime(); // 현재 시간과 createdAt 사이의 차이(밀리초)
  const minutesAgo = Math.floor(diff / (1000 * 60)); // 밀리초를 분으로 변환하여 계산
  const hoursAgo = Math.floor(minutesAgo / 60); // 분을 시간으로 변환하여 계산
  const daysAgo = Math.floor(hoursAgo / 24); // 시간을 일로 변환하여 계산

  if (daysAgo > 30) {
    // 30일 이상인 경우 한 달 전을 반환
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${monthsAgo}달 전`;
  } else if (daysAgo > 7) {
    // 7일 이상인 경우 일주일 전을 반환
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${weeksAgo}주일 전`;
  } else if (daysAgo > 0) {
    // 1일 이상인 경우 일수로 반환
    return `${daysAgo}일 전`;
  } else if (hoursAgo > 0) {
    // 1시간 이상인 경우 시간으로 반환
    return `${hoursAgo}시간 전`;
  } else {
    // 1시간 미만인 경우 분으로 반환
    return `${minutesAgo}분 전`;
  }
};

export default CalculateTimeAgo;
