import React, {
  ChangeEvent,
  DetailedHTMLProps,
  ReactNode,
  SelectHTMLAttributes,
  cloneElement,
  isValidElement,
  useCallback,
} from 'react';
import cn from 'classnames';
import { DownOutlined } from '../../../assets';
import './Select.css';

interface SelectProps
  extends Omit<
    DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
    'onChange'
  > {
  options: { label: string; value: any }[];
  onChange: (value: any) => any;
  suffixIcon?: ReactNode;
}

const Select: React.FC<SelectProps> = ({ options, onChange, suffixIcon, ...props }) => {
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      onChange(evt.target.value);
    },
    [onChange]
  );

  return (
    <div className="gantt-controls-select-wrap">
      {isValidElement(suffixIcon)
        ? cloneElement(suffixIcon, {
            ...suffixIcon.props,
            className: cn('gantt-controls-select-suffix-icon', suffixIcon.props.className),
          })
        : null}
      <select
        className={cn('gantt-controls-select', {
          ['gantt-controls-select-with-suffix']: isValidElement(suffixIcon),
        })}
        onChange={handleChange}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={label + value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <DownOutlined className="gantt-controls-select-arrow" />
    </div>
  );
};

export default Select;
