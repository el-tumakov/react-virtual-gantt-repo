import { createContext } from 'react';
import { BarsRowContextType } from '../../../../types';

export const BarsRowContext = createContext<BarsRowContextType>({
  barData: {
    key: '',
    title: '',
    level: 0,
    parentsKeys: [''],
    color: '',
  },
});
