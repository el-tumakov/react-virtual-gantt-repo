import omit from 'lodash/omit';
import colors from '../constants/colors.json';
import { GanttItemDataType, RawGanttDataType } from '../types';

export const transformData = (
  data: RawGanttDataType[],
  expanded = true,
  level = 0,
  index = 0,
  parentsKeys: string[] = []
): GanttItemDataType[] => {
  return data.reduce<GanttItemDataType[]>((acc, item) => {
    const currentIndex = index + acc.length;

    if (item?.children?.length) {
      const childrenData = transformData(item.children, expanded, level + 1, currentIndex + 1, [
        ...parentsKeys,
        item.key,
      ]);

      const result = [
        ...acc,
        {
          color: colors[currentIndex % colors.length],
          ...omit(item, 'children'),
          expanded,
          level,
          parentsKeys,
        },
        ...childrenData,
      ];

      return result;
    }

    const result = [
      ...acc,
      {
        color: colors[currentIndex % colors.length],
        ...omit(item, 'children'),
        level,
        parentsKeys,
      },
    ];

    return result;
  }, []);
};
