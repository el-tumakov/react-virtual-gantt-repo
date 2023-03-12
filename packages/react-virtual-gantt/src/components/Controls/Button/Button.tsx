import React, { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import './Button.css';

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, icon, ...props }) => {
  return (
    <button className="gantt-controls-button" {...props}>
      {icon} {children}
    </button>
  );
};

export default Button;
