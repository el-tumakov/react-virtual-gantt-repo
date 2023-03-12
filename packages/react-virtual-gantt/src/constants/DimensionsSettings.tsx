import { GanttDimensions, GanttUnitOfTimes } from '../enums';
import { GanttConsts } from './GanttConsts';

export const GanttDimensionsSettings = {
  [GanttDimensions.HOUR]: {
    value: 0,
    hours: 1,
    label: '1 hour',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 1,
    secondsInPixel: (GanttConsts.SECONDS_IN_HOUR * 1) / GanttConsts.SCALE_STEP_DEFAULT_WIDTH,
  },
  [GanttDimensions.TWO_HOURS]: {
    value: 1,
    hours: 2,
    label: '2 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 2,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 2,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 2) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.THREE_HOURS]: {
    value: 2,
    hours: 3,
    label: '3 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 3,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 3,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 3) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.FOUR_HOURS]: {
    value: 3,
    hours: 4,
    label: '4 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 4,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 4,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 4) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.SIX_HOURS]: {
    value: 4,
    hours: 6,
    label: '6 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 6,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 6,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 6) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.EIGHT_HOURS]: {
    value: 5,
    hours: 8,
    label: '8 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 8,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 8,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 8) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.TWELVE_HOURS]: {
    value: 6,
    hours: 12,
    label: '12 hours',
    unitOfTime: GanttUnitOfTimes.DAY,
    itemsCount: 11 * 12,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 12,
    secondsInPixel:
      (GanttConsts.SECONDS_IN_HOUR * 12) /
      (GanttConsts.SCALE_STEP_DEFAULT_WIDTH * GanttConsts.SCALE_STEP_RATIO),
  },
  [GanttDimensions.DAY]: {
    value: 7,
    hours: 24,
    label: '1 day',
    unitOfTime: GanttUnitOfTimes.MONTH,
    itemsCount: 11,
    stepWidth: GanttConsts.SCALE_STEP_DEFAULT_WIDTH,
    scaleStepItems: GanttConsts.HOURS_IN_DAY / 24,
    secondsInPixel: (GanttConsts.SECONDS_IN_HOUR * 24) / GanttConsts.SCALE_STEP_DEFAULT_WIDTH,
  },
};
