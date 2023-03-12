import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import BarItem from '../BarItem';
import { GanttConsts } from '../../../../../constants';
import { DataRepeatTypes } from '../../../../../enums';
import { OnBarDoubleClickType, RepeatDataType } from '../../../../../types';

interface RepeteadBarsProps {
  data: RepeatDataType;
  firstRenderedDate: number;
  lastRenderedDate: number;
  title: string;
  barKey: string;
  onBarDoubleClick?: OnBarDoubleClickType;
}

const RepeteadBars: React.FC<RepeteadBarsProps> = ({
  data,
  firstRenderedDate,
  lastRenderedDate,
  title,
  barKey,
  onBarDoubleClick,
}) => {
  const fromDate = useMemo(() => {
    if (!firstRenderedDate) {
      return null;
    }

    const date = data.fromDate ? dayjs(data.fromDate).unix() : firstRenderedDate;

    return date > firstRenderedDate ? date : firstRenderedDate;
  }, [data.fromDate, firstRenderedDate]);

  const toDate = useMemo(() => {
    if (!lastRenderedDate) {
      return null;
    }

    const date = data.toDate ? dayjs(data.toDate).unix() : lastRenderedDate;

    return date < lastRenderedDate ? date : lastRenderedDate;
  }, [data.toDate, lastRenderedDate]);

  const duration = useMemo(() => {
    return data.toTime < data.fromTime
      ? data.toTime + GanttConsts.SECONDS_IN_DAY - data.fromTime
      : data.toTime - data.fromTime;
  }, [data.fromTime, data.toTime]);

  const dates = useMemo(() => {
    if (!fromDate || !toDate || !duration) {
      return [];
    }

    const result = [];

    let startDate = dayjs.unix(fromDate).startOf('day').add(data.fromTime, 'seconds').unix();

    switch (data.repeatType) {
      case DataRepeatTypes.DAY: {
        while (startDate <= toDate) {
          result.push({
            startDate,
            endDate: startDate + duration,
          });

          startDate = startDate + GanttConsts.SECONDS_IN_DAY;
        }

        break;
      }

      case DataRepeatTypes.WEEK:
        while (startDate <= toDate) {
          if (data.weekdays?.includes(+dayjs.unix(startDate).format('d'))) {
            result.push({
              startDate,
              endDate: startDate + duration,
            });
          }

          startDate = startDate + GanttConsts.SECONDS_IN_DAY;
        }

        break;

      case DataRepeatTypes.MONTH:
        while (startDate <= toDate) {
          if (data.monthdays?.includes(+dayjs.unix(startDate).format('D'))) {
            result.push({
              startDate,
              endDate: startDate + duration,
            });
          }

          startDate = startDate + GanttConsts.SECONDS_IN_DAY;
        }

        break;
    }

    return result;
  }, [data, duration, fromDate, toDate]);

  if (!fromDate || !toDate) {
    return null;
  }

  return (
    <>
      {dates.map(({ startDate, endDate }) => (
        <BarItem
          key={barKey + startDate}
          title={title}
          barKey={barKey}
          startDate={startDate}
          endDate={endDate}
          repetead={true}
          onBarDoubleClick={onBarDoubleClick}
        />
      ))}
    </>
  );
};

export default RepeteadBars;
