import React from 'react';
import { IconProps } from '../../types';

export const MinusSquareOutlined: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.436 22.5H7.064C3.437 22.5 1 19.954 1 16.165V7.335C1 3.546 3.437 1 7.064 1H16.436C20.063 1 22.5 3.546 22.5 7.335V16.165C22.5 19.954 20.063 22.5 16.436 22.5Z"
        fill="var(--gantt-control-element-bg)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.417 12.4902H8.08398C7.66898 12.4902 7.33398 12.1542 7.33398 11.7402C7.33398 11.3262 7.66898 10.9902 8.08398 10.9902H15.417C15.831 10.9902 16.167 11.3262 16.167 11.7402C16.167 12.1542 15.831 12.4902 15.417 12.4902Z"
        fill="var(--gantt-text-color)"
      />
    </svg>
  );
};
