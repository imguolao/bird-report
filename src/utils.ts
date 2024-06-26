export type RangeDate = {
  start: string;
  end: string;
}

export function log(...args: any[]) {
  console.log('[🐦bird-report-crx]:', ...args);
}

export function mergeTimeRanges(ranges: RangeDate[]) {
  if (ranges.length === 0) return [];

  // 将时间范围按照开始时间排序
  ranges.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const mergedRanges = [ranges[0]];

  for (let i = 1; i < ranges.length; i++) {
    const lastMergedRange = mergedRanges[mergedRanges.length - 1];
    const currentRange = ranges[i];

    if (new Date(currentRange.start) <= new Date(lastMergedRange.end)) {
      // 如果当前时间段的开始时间小于等于上一个融合的时间段的结束时间，则进行融合
      lastMergedRange.end = new Date(Math.max(new Date(lastMergedRange.end).getTime(), new Date(currentRange.end).getTime()))
        .toISOString()
        .split('T')[0];
    } else {
      // 否则，直接将当前时间段加入融合后的时间段数组中
      mergedRanges.push(currentRange);
    }
  }

  return mergedRanges;
}

export function timeKey() {
  return new Date().getTime().toString();
}

export function getMonthsInRange(range: RangeDate) {
  const { start, end } = range;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months = new Set<string>();

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    months.add(month);
    // 移动到下一个月
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return Array.from(months);
}

export function generateMonthArray() {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    months.push(String(i).padStart(2, '0'));
  }
  return months;
}
