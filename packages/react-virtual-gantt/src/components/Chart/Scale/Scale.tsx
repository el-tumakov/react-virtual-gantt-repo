import React, { RefObject, forwardRef, useCallback, useContext, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  VariableSizeList as List,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
} from 'react-window';
import { GanttContext } from '../../Gantt/GanttContext';
import { useForwardRef } from '../../../hooks';
import { getScaleItems } from '../../../utils';
import { GanttDimensions } from '../../../enums';
import { GanttConsts, GanttDimensionsSettings } from '../../../constants';
import './Scale.css';

interface ScaleProps {
  width: number;
  wrapRef: RefObject<HTMLDivElement>;
}

const Scale = forwardRef<List<number[]>, ScaleProps>(({ width, wrapRef }, ref) => {
  const { scaleDates, setScaleDates, setScaleRenderState, settings } = useContext(GanttContext);
  const listRef = useForwardRef<List<number[]>>(ref);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const getItemSize = useCallback(
    (index: number) => {
      const date = dayjs.unix(scaleDates[index]);

      if (settings.dimension === GanttDimensions.DAY) {
        const days = date.daysInMonth();

        return days * settings.stepWidth;
      }

      return settings.scaleStepItems * settings.stepWidth;
    },
    [scaleDates, settings.dimension, settings.scaleStepItems, settings.stepWidth]
  );

  const onScroll = useCallback(
    ({ scrollOffset }: ListOnScrollProps) => {
      const unitOfTime = GanttDimensionsSettings[settings.dimension].unitOfTime;

      if (scrollOffset < GanttConsts.MIN_SCROLL_OFFSET) {
        const newDate = dayjs.unix(scaleDates[0]).subtract(1, unitOfTime);
        let newItemWidth = settings.scaleStepItems * settings.stepWidth;

        if (settings.dimension === GanttDimensions.DAY) {
          const days = newDate.daysInMonth();

          newItemWidth = days * settings.stepWidth;
        }

        setScaleDates([newDate.unix(), ...scaleDates]);

        wrapRef.current?.scrollTo({ left: scrollOffset + newItemWidth });
        listRef?.current?.resetAfterIndex(0);
      }

      if (
        (outerRef.current?.scrollWidth || 0) -
          (outerRef.current?.clientWidth || 0) -
          scrollOffset -
          GanttConsts.TREE_WIDTH <
        GanttConsts.MIN_SCROLL_OFFSET
      ) {
        setScaleDates([
          ...scaleDates,
          dayjs
            .unix(scaleDates[scaleDates.length - 1])
            .add(1, unitOfTime)
            .unix(),
        ]);
        listRef?.current?.resetAfterIndex(0);
      }
    },
    [
      listRef,
      scaleDates,
      setScaleDates,
      settings.dimension,
      settings.scaleStepItems,
      settings.stepWidth,
      wrapRef,
    ]
  );

  const onItemsRendered = useCallback(
    (renderedState: ListOnItemsRenderedProps) => {
      setScaleRenderState(renderedState);
    },
    [setScaleRenderState]
  );

  useEffect(() => {
    listRef?.current?.resetAfterIndex(0);
  }, [listRef, settings.dimension]);

  return (
    <div className="gantt-scale-wrap">
      <List
        className="gantt-scale-list"
        layout="horizontal"
        width={width}
        height={GanttConsts.HEADER_HEIGHT}
        itemCount={scaleDates.length}
        itemSize={getItemSize}
        itemData={scaleDates}
        ref={listRef}
        outerRef={outerRef}
        innerRef={innerRef}
        initialScrollOffset={settings.initialScrollOffset}
        onScroll={onScroll}
        onItemsRendered={onItemsRendered}
      >
        {({ style, index, data }) => {
          return (
            <div className="gantt-scale-item" style={style}>
              <div className="gantt-scale-title">
                {dayjs
                  .unix(data[index])
                  .format(
                    settings.dimension === GanttDimensions.DAY ? 'MMMM, YYYY' : 'ddd, D MMMM, YY'
                  )}
              </div>
              <div className="gantt-scale-steps">
                {getScaleItems(settings.dimension, data[index]).map((item) => (
                  <div
                    className="gantt-scale-step"
                    key={item}
                    style={{ width: settings.stepWidth }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </List>
    </div>
  );
});

Scale.displayName = 'Scale';

export default Scale;
