import dayjs from 'dayjs';
import { GanttDimensions } from '../enums';

export const getWholeWidth = (
  scaleDates: number[],
  dimension: GanttDimensions,
  stepItemsCount: number,
  stepWidth: number
) => {
  if (dimension === GanttDimensions.DAY) {
    return (
      stepWidth *
      scaleDates.reduce((acc: number, date: number) => acc + dayjs.unix(date).daysInMonth(), 0)
    );
  }

  return scaleDates.length * stepItemsCount * stepWidth;
};
