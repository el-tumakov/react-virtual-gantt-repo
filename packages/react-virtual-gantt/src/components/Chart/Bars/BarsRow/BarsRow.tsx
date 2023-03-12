import React, { CSSProperties, useContext, useMemo } from 'react';
import BarsItems from './BarsItems';
import { BarsRowContext } from './BarsRowContext';
import { GanttContext } from '../../../Gantt/GanttContext';
import { GanttItemDataType, OnBarDoubleClickType } from '../../../../types';
import './BarsRow.css';

interface BarsRowProps {
  barData: GanttItemDataType;
  index: number;
  style: CSSProperties;
  onBarDoubleClick?: OnBarDoubleClickType;
}

const BarsRow: React.FC<BarsRowProps> = ({ barData, index, style, onBarDoubleClick }) => {
  const { settings } = useContext(GanttContext);

  const wrapStyle = useMemo(() => {
    return {
      ...style,
      backgroundImage: `repeating-linear-gradient(to right, var(--gantt-border-color-base) 0px 1px, ${
        index % 2 === 0 ? 'var(--gantt-background-second)' : 'var(--gantt-background-main)'
      } 1px ${settings.stepWidth}px`,
    };
  }, [index, settings.stepWidth, style]);

  return (
    <BarsRowContext.Provider value={{ barData }}>
      <div className="gantt-bars-row-wrap" style={wrapStyle}>
        <BarsItems
          data={barData.data}
          title={barData.title}
          barKey={barData.key}
          onBarDoubleClick={onBarDoubleClick}
        />
      </div>
    </BarsRowContext.Provider>
  );
};

export default BarsRow;
