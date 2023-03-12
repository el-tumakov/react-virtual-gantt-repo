import React, { SyntheticEvent, memo, useCallback, useContext, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Tippy from '@tippyjs/react';
import { followCursor } from 'tippy.js';
import cn from 'classnames';
import dayjs from 'dayjs';
import { BarsRowContext } from '../BarsRowContext';
import { GanttContext } from '../../../../Gantt/GanttContext';
import { DragTypes } from '../../../../../enums';
import { OnBarDoubleClickType } from '../../../../../types';
import 'tippy.js/dist/tippy.css';
import './BarItem.css';

let onPointerDownTimeout: NodeJS.Timeout;

type BarItemProps = {
  title: string;
  barKey: string;
  startDate: number;
  endDate: number;
  repetead: boolean;
  onBarDoubleClick?: OnBarDoubleClickType;
};

const BarItem = memo<BarItemProps>(
  ({ title, barKey, startDate, endDate, repetead, onBarDoubleClick }: BarItemProps) => {
    const { scaleDates, settings } = useContext(GanttContext);
    const { barData } = useContext(BarsRowContext);
    const { attributes, listeners, transform, activatorEvent, setNodeRef, setActivatorNodeRef } =
      useDraggable({
        id: barKey,
      });

    const startWidth = useMemo(() => {
      return (endDate - startDate) / settings.secondsInPixel;
    }, [endDate, settings.secondsInPixel, startDate]);

    const maxWidth = useMemo(() => {
      return repetead ? (24 * 3600 - 1) / settings.secondsInPixel : 0;
    }, [repetead, settings.secondsInPixel]);

    const startPosition = useMemo(() => {
      return (startDate - scaleDates[0]) / settings.secondsInPixel;
    }, [scaleDates, settings.secondsInPixel, startDate]);

    const activeDragType = useMemo(() => {
      const target: any = activatorEvent?.target;

      return +target?.dataset?.dragtype;
    }, [activatorEvent?.target]);

    const delta = useMemo(() => {
      if (!transform) {
        return 0;
      }

      const maxDelta = maxWidth ? maxWidth - startWidth : null;
      const minDelta = settings.gridSize - startWidth;

      let newDelta = activeDragType === DragTypes.RESIZE_LEFT ? -transform.x : transform.x;

      if (newDelta !== 0 && activeDragType !== DragTypes.DRAG) {
        if (maxDelta !== null && newDelta > maxDelta) {
          newDelta = maxDelta;
        }

        if (newDelta < minDelta) {
          newDelta = minDelta;
        }
      }

      return newDelta;
    }, [activeDragType, maxWidth, settings.gridSize, startWidth, transform]);

    const itemWidth = useMemo(() => {
      return activeDragType === DragTypes.DRAG ? startWidth : startWidth + delta;
    }, [activeDragType, delta, startWidth]);

    const translateStyle = useMemo(() => {
      if (activeDragType === DragTypes.DRAG) {
        return `translateX(${delta}px)`;
      }

      return `translateX(${activeDragType === DragTypes.RESIZE_LEFT ? -delta : 0}px)`;
    }, [activeDragType, delta]);

    const startTime = useMemo(() => {
      const deltaInSeconds = [DragTypes.RESIZE_LEFT, DragTypes.DRAG].includes(activeDragType)
        ? delta * settings.secondsInPixel
        : 0;

      return dayjs
        .unix(
          startDate + (activeDragType === DragTypes.RESIZE_LEFT ? -deltaInSeconds : deltaInSeconds)
        )
        .format('L LTS');
    }, [activeDragType, delta, settings.secondsInPixel, startDate]);

    const endTime = useMemo(() => {
      const deltaInSeconds = [DragTypes.RESIZE_RIGHT, DragTypes.DRAG].includes(activeDragType)
        ? delta * settings.secondsInPixel
        : 0;

      return dayjs.unix(endDate + deltaInSeconds).format('L LTS');
    }, [activeDragType, delta, endDate, settings.secondsInPixel]);

    const onDoubleClick = useCallback(() => {
      if (onBarDoubleClick) {
        onBarDoubleClick(barData);
      }
    }, [barData, onBarDoubleClick]);

    const onPointerDown = useCallback(
      (evt: SyntheticEvent) => {
        onPointerDownTimeout = setTimeout(() => {
          if (listeners?.onPointerDown) {
            listeners.onPointerDown(evt);
          }
        }, 200);
      },
      [listeners]
    );

    const onPointerUp = useCallback(() => {
      if (onPointerDownTimeout) {
        clearTimeout(onPointerDownTimeout);
      }
    }, []);

    return (
      <Tippy
        className="gantt-bars-row-item-tooltip"
        trigger="mousedown"
        followCursor="horizontal"
        plugins={[followCursor]}
        content={`${startTime} → ${endTime}`}
      >
        <div
          className="gantt-bars-row-item-wrap"
          style={{
            position: 'absolute',
            height: '40px',
            top: 0,
            left: startPosition,
            width: itemWidth,
            transform: translateStyle,
          }}
          ref={setNodeRef}
        >
          <div
            className="gantt-bars-row-item-bar"
            style={{
              backgroundColor: barData.color,
            }}
            data-dragtype={DragTypes.DRAG}
            {...listeners}
            {...attributes}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onDoubleClick={onDoubleClick}
          >
            <div
              className={cn('gantt-bars-row-item-left-button', 'gantt-bars-row-item-button', {
                ['gantt-bars-row-item-button-hidden']: itemWidth < 25,
              })}
              ref={setActivatorNodeRef}
              data-dragtype={DragTypes.RESIZE_LEFT}
              {...listeners}
              {...attributes}
            />
            <div
              className={cn('gantt-bars-row-item-title', {
                ['gantt-bars-row-item-title-hidden']: itemWidth < 100,
              })}
              data-dragtype={DragTypes.DRAG}
            >
              {title}
            </div>
            <div
              className={cn('gantt-bars-row-item-right-button', 'gantt-bars-row-item-button', {
                ['gantt-bars-row-item-button-hidden']: itemWidth < 25,
              })}
              ref={setActivatorNodeRef}
              data-dragtype={DragTypes.RESIZE_RIGHT}
              {...listeners}
              {...attributes}
            />
          </div>
        </div>
      </Tippy>
    );
  }
);

BarItem.displayName = 'BarItem';

export default BarItem;
