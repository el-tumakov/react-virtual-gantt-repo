import React, {
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier, restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import dayjs from 'dayjs';
import { VariableSizeList as List } from 'react-window';
import BarsRow from './BarsRow';
import { GanttContext } from '../../Gantt/GanttContext';
import { getWholeWidth } from '../../../utils';
import { DragTypes } from '../../../enums';
import { GanttConsts } from '../../../constants';
import { GanttItemDataType, OnBarChangeType, OnBarDoubleClickType } from '../../../types';
import './Bars.css';

interface InnerElementProps {
  scaleWidth: number;
  style: CSSProperties;
  children: ReactNode;
}

interface BarsProps {
  width: number;
  height: number;
  data: GanttItemDataType[];
  setData: Dispatch<SetStateAction<GanttItemDataType[]>>;
  onBarDoubleClick?: OnBarDoubleClickType;
  onBarChange?: OnBarChangeType;
}

const InnerElement: React.FC<InnerElementProps> = ({ scaleWidth, style, children, ...props }) => {
  return (
    <div style={{ ...style, width: scaleWidth, position: 'relative' }} {...props}>
      {children}
    </div>
  );
};
const Bars = forwardRef<List, BarsProps>(
  ({ width, height, data, setData, onBarDoubleClick, onBarChange }, ref) => {
    const { settings, scaleDates } = useContext(GanttContext);

    const scaleWidth = useMemo(() => {
      return getWholeWidth(
        scaleDates,
        settings.dimension,
        settings.scaleStepItems,
        settings.stepWidth
      );
    }, [scaleDates, settings.dimension, settings.scaleStepItems, settings.stepWidth]);

    const snapToGrid = useMemo(() => createSnapModifier(settings.gridSize), [settings.gridSize]);

    const barsData = useMemo(() => {
      const collapsedKeys: string[] = [];

      for (const item of data) {
        if (item.hasOwnProperty('expanded') && !item.expanded) {
          collapsedKeys.push(item.key);
        }
      }

      return data.filter((item) => {
        const isParentCollapsed = item.parentsKeys.some((key) => collapsedKeys.includes(key));

        return !isParentCollapsed;
      });
    }, [data]);

    const itemSize = useCallback(() => {
      return GanttConsts.ROW_HEIGHT;
    }, []);

    const onDragEnd = useCallback(
      (evt: DragEndEvent) => {
        const secondsDelta = evt.delta.x * settings.secondsInPixel;
        const secondsInDay = 3600 * 24;
        const secondsInStep = settings.gridSize * settings.secondsInPixel;
        const newData = [...data];
        const item = newData.find((item) => item.key === evt.active.id);
        const target: any = evt.activatorEvent.target;

        if (item?.data?.repeatType && +target?.dataset?.dragtype === DragTypes.RESIZE_RIGHT) {
          const { fromTime, toTime } = item.data;
          let newTime = toTime + secondsDelta;

          if (toTime > fromTime && newTime - fromTime >= secondsInDay) {
            newTime = fromTime - 1;
          } else if (toTime < fromTime && newTime > fromTime) {
            newTime = fromTime - 1;
          } else if (toTime > fromTime && newTime < fromTime) {
            newTime = fromTime + secondsInStep;
          } else if (toTime < fromTime && fromTime - newTime >= secondsInDay) {
            newTime = fromTime + secondsInStep;
          } else if (newTime < 0) {
            newTime = newTime + secondsInDay;
          } else if (newTime >= secondsInDay) {
            newTime = newTime - secondsInDay;
          }

          item.data.toTime = Math.round(newTime);
        }

        if (item?.data?.repeatType && +target?.dataset?.dragtype === DragTypes.RESIZE_LEFT) {
          const { fromTime, toTime } = item.data;
          let newTime = fromTime + secondsDelta;

          if (fromTime < toTime && toTime - newTime >= secondsInDay) {
            newTime = toTime + 1;
          } else if (fromTime > toTime && newTime < toTime) {
            newTime = toTime + 1;
          } else if (fromTime < toTime && newTime > toTime) {
            newTime = toTime - secondsInStep;
          } else if (fromTime > toTime && newTime - toTime >= secondsInDay) {
            newTime = toTime - secondsInStep;
          } else if (newTime < 0) {
            newTime = newTime + secondsInDay;
          } else if (newTime >= secondsInDay) {
            newTime = newTime - secondsInDay;
          }

          item.data.fromTime = Math.round(newTime);
        }

        if (item?.data?.repeatType && +target?.dataset?.dragtype === DragTypes.DRAG) {
          const { fromTime, toTime } = item.data;
          let newFromTime = fromTime + secondsDelta;
          let newToTime = toTime + secondsDelta;

          while (newFromTime < 0) {
            newFromTime = newFromTime + secondsInDay;
          }

          while (newToTime < 0) {
            newToTime = newToTime + secondsInDay;
          }

          while (newFromTime >= secondsInDay) {
            newFromTime = newFromTime - secondsInDay;
          }

          while (newToTime >= secondsInDay) {
            newToTime = newToTime - secondsInDay;
          }

          item.data.fromTime = Math.round(newFromTime);
          item.data.toTime = Math.round(newToTime);
        }

        if (item?.data && !item?.data?.repeatType) {
          const { startDate, endDate } = item.data;

          if (startDate && endDate) {
            const unixStartDate = dayjs(startDate).unix();
            const unixEndDate = dayjs(endDate).unix();

            switch (+target?.dataset?.dragtype) {
              case DragTypes.RESIZE_LEFT: {
                let newDate = unixStartDate + secondsDelta;

                if (unixEndDate - newDate < secondsInStep) {
                  newDate = unixEndDate - secondsInStep;
                }

                item.data.startDate = dayjs.unix(newDate).format();

                break;
              }

              case DragTypes.RESIZE_RIGHT: {
                let newDate = unixEndDate + secondsDelta;

                if (newDate - unixStartDate < secondsInStep) {
                  newDate = unixStartDate + secondsInStep;
                }

                item.data.endDate = dayjs.unix(newDate).format();

                break;
              }

              case DragTypes.DRAG: {
                item.data.startDate = dayjs.unix(Math.round(unixStartDate + secondsDelta)).format();
                item.data.endDate = dayjs.unix(Math.round(unixEndDate + secondsDelta)).format();

                break;
              }
            }
          }
        }

        if (onBarChange) {
          onBarChange(item, newData);
        }

        setData(newData);
      },
      [data, onBarChange, setData, settings.gridSize, settings.secondsInPixel]
    );

    return (
      <div className="gantt-bars-wrap">
        <DndContext
          modifiers={[restrictToHorizontalAxis, snapToGrid]}
          onDragEnd={onDragEnd}
          autoScroll={false}
        >
          <List
            ref={ref}
            className="gantt-bars-list"
            layout="vertical"
            width={width}
            height={height}
            itemCount={barsData.length}
            itemSize={itemSize}
            itemData={barsData}
            innerElementType={(props) => <InnerElement scaleWidth={scaleWidth} {...props} />}
          >
            {({ style, data, index }) => {
              return (
                <BarsRow
                  barData={data[index]}
                  index={index}
                  style={style}
                  onBarDoubleClick={onBarDoubleClick}
                />
              );
            }}
          </List>
        </DndContext>
      </div>
    );
  }
);

Bars.displayName = 'Bars';

export default Bars;
