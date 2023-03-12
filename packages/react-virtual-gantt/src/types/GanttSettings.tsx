import { DragStepSizes, GanttDimensions } from '../enums';

export interface GanttSettingsType {
  stepWidth: number;
  secondsInPixel: number;
  scaleStepItems: number;
  initialScrollOffset: number;
  dimension: GanttDimensions;
  dragStepSize: DragStepSizes;
  gridSize: number;
}
