import dayjs from 'dayjs';
import { GanttUnitOfTimes } from '../enums';

export const getScaleDates = (
  startDate = dayjs().unix(),
  count = 99,
  unitOfTime: dayjs.ManipulateType = GanttUnitOfTimes.DAY
) => {
  const data: number[] = [];

  for (let i = 0; i < count; i++) {
    data.push(
      dayjs
        .unix(startDate)
        .startOf(unitOfTime)
        .subtract(Math.floor(count / 2) - i, unitOfTime)
        .unix()
    );
  }

  return data;
};
