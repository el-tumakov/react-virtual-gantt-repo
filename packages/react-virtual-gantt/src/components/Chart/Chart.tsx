import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import { VariableSizeList as List } from 'react-window';
import Bars from './Bars';
import Scale from './Scale';
import Tree from './Tree';
import { GanttContext } from '../Gantt/GanttContext';
import { transformData } from '../../utils';
import { GanttConsts, GanttDimensionsSettings } from '../../constants';
import {
  GanttDataType,
  GanttItemDataType,
  OnBarChangeType,
  OnBarDoubleClickType,
} from '../../types';
import './Chart.css';

interface ChartProps {
  data: GanttDataType[];
  className?: string;
  onBarDoubleClick?: OnBarDoubleClickType;
  onBarChange?: OnBarChangeType;
}

const Chart: React.FC<ChartProps> = ({ data, className, onBarDoubleClick, onBarChange }) => {
  const { settings, scaleDates, wrapRef, setCurrentDate } = useContext(GanttContext);
  const scaleRef = useRef<List>(null);
  const treeRef = useRef<List>(null);
  const barsRef = useRef<List>(null);
  const [transformedData, setTransformedData] = useState<GanttItemDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const setNewCurrentDate = useCallback(() => {
    const secondsDiff = Math.round(
      ((wrapRef?.current?.scrollLeft || 0) + GanttConsts.TREE_WIDTH) *
        GanttDimensionsSettings[settings.dimension].secondsInPixel
    );

    setCurrentDate(scaleDates[0] + secondsDiff);
  }, [scaleDates, setCurrentDate, settings.dimension, wrapRef]);

  const debounceSetCurrentDate = useMemo(() => {
    return debounce(setNewCurrentDate, 100);
  }, [setNewCurrentDate]);

  useEffect(() => {
    if (wrapRef?.current?.clientWidth && wrapRef?.current?.clientHeight) {
      setWidth(wrapRef.current.clientWidth - GanttConsts.TREE_WIDTH);
      setHeight(wrapRef.current.clientHeight - GanttConsts.HEADER_HEIGHT);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && wrapRef.current) {
      wrapRef.current.scrollLeft = settings.initialScrollOffset;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setTransformedData(transformData(data));
  }, [data]);

  return (
    <div
      className={cn('gantt-chart-wrap', className)}
      ref={wrapRef}
      onScroll={(evt) => {
        barsRef.current?.scrollTo(evt.currentTarget.scrollTop);
        treeRef.current?.scrollTo(evt.currentTarget.scrollTop);
        scaleRef.current?.scrollTo(evt.currentTarget.scrollLeft);

        debounceSetCurrentDate();
      }}
    >
      {loading ? (
        <div
          style={{
            width: settings.scaleStepItems * settings.stepWidth * scaleDates.length,
          }}
        />
      ) : (
        <>
          <Scale width={width} wrapRef={wrapRef} ref={scaleRef} />
          <Tree height={height} data={transformedData} setData={setTransformedData} ref={treeRef} />
          <Bars
            ref={barsRef}
            data={transformedData}
            setData={setTransformedData}
            width={width}
            height={height}
            onBarDoubleClick={onBarDoubleClick}
            onBarChange={onBarChange}
          />
        </>
      )}
    </div>
  );
};

export default Chart;
