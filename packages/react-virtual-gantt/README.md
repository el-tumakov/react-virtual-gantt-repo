# `react-virtual-gantt`

Gantt chart component for React.

It's still under development. I'll be gratefull for your issues and suggestions.

![demonstration of react-virtual-gantt](https://media.giphy.com/media/eYYcpKWzXmMuVC0FOs/giphy.gif)

[Demo](https://react-virtual-gantt.vercel.app/)

## Features

- biderectional infinity scroll by dates
- horizontal and vertical virtualization
- nested items
- repeating items (everyday, specific days of week, specific days of month)
- zoom from 1 hour to 1 day
- change step from 5 min to 1 day

## Installation

```bash
# npm
npm install react-virtual-gantt

# yarn
yarn add react-virtual-gantt
```

## Usage

The component gets the height and width of its parent.

```tsx
import { Gantt, GanttDataType } from "react-virtual-gantt";

const GanttComponent = ({data: GanttDataType[]}) => {
  return (
    <div>
      <Gantt>
        <Gantt.Controls />
        <Gantt.Chart data={data} />
      </Gantt>
    </div>
  );
}
```

## Props

The gantt is under development and props will be greatly expanded in the future.

### `Gantt.Chart`

Component for drawing the chart itslef.

#### `data: GanttDataType[]`

Example:

```ts
[
  {
    key: 'task-1',
    title: 'Some task without data',
    children: [
      {
        key: 'task-1-1',
        title: 'Some non repeating task',
        data: {
          startDate: '2023-03-09T08:00:00.000Z',
          endDate: '2023-03-09T08:00:00.000Z',
        },
        children: [
          {
            key: 'task-1-1-1',
            title: 'Some weekly repeating task',
            data: {
              repeatType: 'WEEK',
              fromTime: 28800,
              endDate: 64800,
              weekdays: [1, 3, 6],
            },
          },
        ],
      },
      {
        key: 'task-1-2',
        title: 'Some daily repeating task',
        data: {
          repeatType: 'DAY',
          fromTime: 28800,
          endDate: 64800,
        },
      },
    ],
  },
  {
    key: 'task-2',
    title: 'Some monthly repeating task',
    data: {
      repeatType: 'MONTH',
      fromTime: 28800,
      endDate: 64800,
      monthdays: [1, 3, 5, 9, 11, 14, 21, 31],
    },
  },
];
```

#### `className?: string`

#### `onBarDoubleClick?: OnBarDoubleClickType`

#### `onBarChange?: OnBarChangeType`

### `Gantt.Controls`

Сomponent for displaying the current date and controls for the scale and bar change step.

#### `className?: string`
