import React, { useCallback, useContext, useMemo, useState } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import Button from './Button';
import Select from './Select';
import { LeftOutlined, RightOutlined, StepOutlined } from '../../assets';
import { GanttContext } from '../Gantt/GanttContext';
import { useGanttCalculate } from '../../hooks';
import { DragStepSizes, GanttDimensions } from '../../enums';
import { DragStepOptions, GanttDimensionsSettings } from '../../constants';
import './Controls.css';

interface ControlsProps {
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({ className }) => {
  const { calculate } = useGanttCalculate();
  const { settings, setSettings, currentDate } = useContext(GanttContext);
  const [dimensionValue, setDimensionValue] = useState(GanttDimensions.HOUR);
  const [dimensionIndex, setDimensionIndex] = useState(0);

  const dimensionsOptions = useMemo(() => {
    return Object.keys(GanttDimensionsSettings).map((key, index) => {
      return {
        label: GanttDimensionsSettings[key as GanttDimensions].label,
        value: key as GanttDimensions,
        index,
      };
    });
  }, []);

  const onDimensionChange = useCallback(
    (value: GanttDimensions) => {
      const index = dimensionsOptions.findIndex((item) => item.value === value);

      setDimensionValue(value);
      setDimensionIndex(index);
      calculate(value);
    },
    [calculate, dimensionsOptions]
  );

  const onNextDimension = useCallback(() => {
    if (dimensionIndex < dimensionsOptions.length - 1) {
      const value = Object.keys(GanttDimensionsSettings)[dimensionIndex + 1] as GanttDimensions;

      setDimensionValue(value);
      setDimensionIndex(dimensionIndex + 1);
      calculate(value);
    }
  }, [calculate, dimensionsOptions.length, dimensionIndex]);

  const onPrevDimension = useCallback(() => {
    if (dimensionIndex > 0) {
      const value = Object.keys(GanttDimensionsSettings)[dimensionIndex - 1] as GanttDimensions;

      setDimensionValue(value);
      setDimensionIndex(dimensionIndex - 1);
      calculate(value);
    }
  }, [calculate, dimensionIndex]);

  const dragStepOptions = useMemo(() => {
    return Object.keys(DragStepOptions).map((key) => {
      return {
        label: DragStepOptions[key as DragStepSizes].label,
        value: key as DragStepSizes,
      };
    });
  }, []);

  const onDragStepChange = useCallback(
    (value: DragStepSizes) => {
      setSettings(() => {
        const newSettings = { ...settings };

        newSettings.dragStepSize = value;
        newSettings.gridSize =
          DragStepOptions[value].seconds /
          GanttDimensionsSettings[newSettings.dimension].secondsInPixel;

        return newSettings;
      });
    },
    [setSettings, settings]
  );

  return (
    <div className={cn('gantt-controls-wrap', className)}>
      <Button icon={<LeftOutlined />} onClick={onPrevDimension} disabled={dimensionIndex <= 0} />
      <Select options={dimensionsOptions} onChange={onDimensionChange} value={dimensionValue} />
      <Button
        icon={<RightOutlined />}
        onClick={onNextDimension}
        disabled={dimensionIndex >= dimensionsOptions.length - 1}
      />
      <div className="gantt-controls-current-date">{dayjs.unix(currentDate).format('ddd, ll')}</div>
      <Select
        options={dragStepOptions}
        onChange={onDragStepChange}
        value={settings.dragStepSize}
        suffixIcon={<StepOutlined />}
      />
    </div>
  );
};

export default Controls;
