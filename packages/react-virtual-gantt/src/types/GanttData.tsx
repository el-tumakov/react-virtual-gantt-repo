import { DataRepeatTypes } from '../enums';

export type RepeatDataType = {
  /**
   * Type of repeatable gantt item
   */
  repeatType: DataRepeatTypes;
  /**
   * Repeatable gantt item start time in seconds (0-86400)
   */
  fromTime: number;
  /**
   * Repeatable gantt item end time in seconds (0-86400)
   */
  toTime: number;
  /**
   * Start date of repeatable gantt items
   */
  fromDate?: string;
  /**
   * End date of Repeatable gantt items
   */
  toDate?: string;
  /**
   * Numbers of weekdays for repeating (0-6)
   */
  weekdays?: number[];
  /**
   * Numbers of monthdays for repeating (0-31)
   */
  monthdays?: number[];
  startDate?: never;
  endDate?: never;
};

export type NoRepeatDataType = {
  /**
   * Start date and time of unrepeatable bar item
   */
  startDate: string;
  /**
   * End date and time of unrepeatable bar item
   */
  endDate: string;
  fromTime?: never;
  toTime?: never;
  fromDate?: never;
  toDate?: never;
  repeatType?: never;
  weekdays?: never;
  monthdays?: never;
};

export type BarItemDataType = RepeatDataType | NoRepeatDataType;

export type RawGanttDataType<T = Record<string, unknown>> = {
  /**
   * Title of gantt item
   */
  title: string;
  /**
   * Unique gantt item key
   */
  key: string;
  /**
   * Color of gantt item
   */
  color?: string;
  /**
   * Data to render gantt item on the chart
   */
  data?: BarItemDataType;
  /**
   * Nested gantt items
   */
  children?: GanttDataType<T>[];
};

export type GanttDataType<T = Record<string, unknown>> = RawGanttDataType<T> & {
  [P in keyof T]: T[P];
};

type TransformedDataType<T> = {
  [P in keyof T as Exclude<P, 'children'>]: T[P];
};

export type GanttItemDataType<T = Record<string, unknown>> = TransformedDataType<
  GanttDataType<T>
> & {
  /**
   * Tree level of gantt item
   */
  level: number;
  /**
   * Parents keys of gantt item
   */
  parentsKeys: string[];
  /**
   * Color of gantt item
   */
  color: string;
  /**
   * Is gantt item expanded?
   */
  expanded?: boolean;
} & T;

export type OnBarDoubleClickType<T extends Record<string, unknown> = any> = (
  barData: GanttItemDataType<T>
) => any;

export type OnBarChangeType<T extends Record<string, unknown> = any> = (
  barData: GanttItemDataType<T>,
  data: (GanttItemDataType<T> & T)[]
) => any;
