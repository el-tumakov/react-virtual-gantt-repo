import React, { Dispatch, SetStateAction, forwardRef, useCallback, useMemo } from 'react';
import { VariableSizeList as List } from 'react-window';
import { MinusSquareOutlined, PlusSquareOutlined } from '../../../assets';
import { GanttConsts } from '../../../constants';
import { GanttItemDataType } from '../../../types';
import './Tree.css';

interface TreeProps {
  height: number;
  data: GanttItemDataType[];
  setData: Dispatch<SetStateAction<GanttItemDataType[]>>;
}

const Tree = forwardRef<List, TreeProps>(({ height, data, setData }, ref) => {
  const treeData = useMemo(() => {
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

  const onLeafClick = useCallback(
    (key: string) => {
      const newData = [...data];
      const element = newData.find((item) => item.key === key);

      if (element?.hasOwnProperty('expanded')) {
        element.expanded = !element.expanded;
      }

      setData(newData);
    },
    [data, setData]
  );

  return (
    <div
      className="gantt-tree-wrap"
      style={{
        width: GanttConsts.TREE_WIDTH,
        marginTop: -GanttConsts.HEADER_HEIGHT,
      }}
    >
      <List
        ref={ref}
        className="gantt-tree-list"
        layout="vertical"
        width="100%"
        height={height}
        itemCount={treeData.length}
        itemSize={() => GanttConsts.ROW_HEIGHT}
        itemData={treeData}
        innerElementType={({ children, props }) => {
          return (
            <div style={{ height: treeData.length * GanttConsts.ROW_HEIGHT }} {...props}>
              <div className="gantt-tree-title" style={{ height: GanttConsts.HEADER_HEIGHT }}>
                Title
              </div>
              <div className="gantt-tree-inner-wrap">{children}</div>
            </div>
          );
        }}
      >
        {({ style, index, data }) => {
          const item = data[index];

          return (
            <button
              className="gantt-tree-list-item"
              style={{
                ...style,
                backgroundColor: `var(--gantt-background-${index % 2 === 0 ? 'second' : 'main'})`,
                paddingLeft:
                  GanttConsts.LEAF_TITLE_PADDING_LEFT +
                  item.level * GanttConsts.LEAF_CHILDREN_PADDING_LEFT,
              }}
              onClick={() => onLeafClick(item.key)}
            >
              {item.hasOwnProperty('expanded') ? (
                item.expanded ? (
                  <MinusSquareOutlined className="gantt-tree-icon" />
                ) : (
                  <PlusSquareOutlined className="gantt-tree-icon" />
                )
              ) : null}
              <div>{data[index].title}</div>
            </button>
          );
        }}
      </List>
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
