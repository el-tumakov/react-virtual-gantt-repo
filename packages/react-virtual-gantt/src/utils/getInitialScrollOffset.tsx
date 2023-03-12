import dayjs from 'dayjs';
import { GanttConsts, GanttDimensionsSettings } from '../constants';
import { GanttDimensions } from '../enums';

export const getInitialScrollOffset = (
  dimension: GanttDimensions,
  scaleDates: number[],
  currentDate?: number
) => {
  const { secondsInPixel, unitOfTime } = GanttDimensionsSettings[dimension];

  const secondsBeforeCurrentDate =
    (currentDate || dayjs().unix()) - dayjs.unix(scaleDates[0]).startOf(unitOfTime).unix();

  return Math.round(secondsBeforeCurrentDate / secondsInPixel) - GanttConsts.TREE_WIDTH;
};
