import {
  DataRepeatTypes,
  GanttDataType,
  NoRepeatDataType,
  RepeatDataType,
  RawGanttDataType,
} from "react-virtual-gantt";

function getRandomRepeatType(): DataRepeatTypes {
  const repeatTypes = [
    DataRepeatTypes.DAY,
    DataRepeatTypes.WEEK,
    DataRepeatTypes.MONTH,
  ];

  return repeatTypes[Math.floor(Math.random() * repeatTypes.length)];
}

function getRandomDate(minDate: Date, maxDate: Date): Date {
  const range = maxDate.getTime() - minDate.getTime();
  const randomTime = Math.floor(Math.random() * range);

  return new Date(minDate.getTime() + randomTime);
}

function getRandomNoRepeatData(minDate: Date, maxDate: Date): NoRepeatDataType {
  const startDate = getRandomDate(minDate, maxDate);
  const endDate = getRandomDate(startDate, maxDate);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

function getRepeatableTitle(repeatType: DataRepeatTypes): string {
  switch (repeatType) {
    case DataRepeatTypes.DAY:
      return "Daily task";
    case DataRepeatTypes.WEEK:
      return "Weekly task";
    case DataRepeatTypes.MONTH:
      return "Monthly task";
    default:
      return "Repeatable task";
  }
}

function getRandomWeekdays(): number[] {
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    if (Math.random() >= 0.5) {
      weekdays.push(i);
    }
  }
  return weekdays;
}

function getRandomMonthdays(): number[] {
  const monthdays = [];
  for (let i = 1; i <= 31; i++) {
    if (Math.random() >= 0.9) {
      monthdays.push(i);
    }
  }
  return monthdays;
}

function getRandomBarData(
  minDate: Date,
  maxDate: Date,
  repeatType?: DataRepeatTypes
): RawGanttDataType["data"] {
  if (repeatType) {
    const fromTime = Math.floor(Math.random() * 86400);
    const toTime = Math.floor(Math.random() * 86400);

    let data: RepeatDataType = {
      repeatType,
      fromTime,
      toTime,
    };

    if (repeatType === DataRepeatTypes.WEEK) {
      const weekdays = getRandomWeekdays();

      data.weekdays = weekdays;
    } else if (repeatType === DataRepeatTypes.MONTH) {
      const monthdays = getRandomMonthdays();

      data.monthdays = monthdays;
    }

    return data;
  }

  return getRandomNoRepeatData(minDate, maxDate);
}

export function getRandomGanttData(
  count: number,
  minDate: Date,
  maxDate: Date,
  level = 1,
  parentKey = ""
): GanttDataType[] {
  const ganttData: GanttDataType[] = [];

  for (let i = 1; i <= count; i++) {
    const isRepeatable = Math.random() <= 0.1;
    let repeatType;
    let repeatTitle;

    if (isRepeatable) {
      repeatType = getRandomRepeatType();
      repeatTitle = getRepeatableTitle(repeatType);
    }

    const key = parentKey + i;
    const title = `Task ${parentKey + i} ${
      repeatTitle ? `[${repeatTitle}]` : ""
    }`;
    const data = getRandomBarData(minDate, maxDate, repeatType);
    const childrenCount = level < 3 ? Math.floor(Math.random() * 4) : 0;
    const children = getRandomGanttData(
      childrenCount,
      minDate,
      maxDate,
      level + 1,
      parentKey + i + "."
    );

    const ganttItem: GanttDataType = {
      key,
      title,
      data,
      children,
    };

    ganttData.push(ganttItem);
  }

  return ganttData;
}
