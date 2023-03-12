import { DragStepSizes } from '../enums';

export const DragStepOptions = {
  [DragStepSizes.FIVE_MIN]: {
    seconds: 5 * 60,
    label: '5 min',
  },
  [DragStepSizes.TEN_MIN]: {
    seconds: 10 * 60,
    label: '10 min',
  },
  [DragStepSizes.FIFTEEN_MIN]: {
    seconds: 15 * 60,
    label: '15 min',
  },
  [DragStepSizes.TWENTY_MIN]: {
    seconds: 20 * 60,
    label: '20 min',
  },
  [DragStepSizes.THIRTY_MIN]: {
    seconds: 30 * 60,
    label: '30 min',
  },
  [DragStepSizes.ONE_HOUR]: {
    seconds: 60 * 60,
    label: '1 hour',
  },
  [DragStepSizes.EIGHT_HOURS]: {
    seconds: 8 * 60 * 60,
    label: '8 hours',
  },
  [DragStepSizes.TWELVE_HOURS]: {
    seconds: 12 * 60 * 60,
    label: '12 hours',
  },
  [DragStepSizes.ONE_DAY]: {
    seconds: 24 * 60 * 60,
    label: '1 day',
  },
};
