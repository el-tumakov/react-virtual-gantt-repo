import React, { useContext, useMemo } from 'react';
import dayjs from 'dayjs';
import BarItem from '../BarItem';
import RepeteadBars from '../RepeteadBars';
import { GanttContext } from '../../../../Gantt/GanttContext';
import { BarItemDataType, OnBarDoubleClickType } from '../../../../../types';

interface BarsItemsProps {
  data?: BarItemDataType;
  title: string;
  barKey: string;
  onBarDoubleClick?: OnBarDoubleClickType;
}

const BarsItems: React.FC<BarsItemsProps> = ({ data, title, barKey, onBarDoubleClick }) => {
  const { scaleDates, scaleRenderState } = useContext(GanttContext);

  const firstRenderedDate = useMemo(() => {
    return scaleDates[scaleRenderState.overscanStartIndex];
  }, [scaleDates, scaleRenderState.overscanStartIndex]);

  const lastRenderedDate = useMemo(() => {
    return scaleDates[scaleRenderState.overscanStopIndex];
  }, [scaleDates, scaleRenderState.overscanStopIndex]);

  const startDate = useMemo(() => {
    return dayjs(data?.startDate).unix();
  }, [data?.startDate]);

  const endDate = useMemo(() => {
    return dayjs(data?.endDate).unix();
  }, [data?.endDate]);

  if (!data) {
    return null;
  }

  if (data.repeatType) {
    return (
      <RepeteadBars
        data={data}
        firstRenderedDate={firstRenderedDate}
        lastRenderedDate={lastRenderedDate}
        title={title}
        barKey={barKey}
        onBarDoubleClick={onBarDoubleClick}
      />
    );
  }

  if (startDate > lastRenderedDate || endDate < firstRenderedDate) {
    return null;
  }

  return (
    <BarItem
      key={data.startDate}
      title={title}
      barKey={barKey}
      startDate={startDate}
      endDate={endDate}
      repetead={false}
      onBarDoubleClick={onBarDoubleClick}
    />
  );
};

export default BarsItems;
