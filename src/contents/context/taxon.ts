import { createContext } from 'react';
import { TaxonResult } from '../request';

export const TaxonDataContext = createContext<{
  taxonResult: TaxonResult | undefined,
  setTaxonResult: (data: TaxonResult) => void,
}>({
  taxonResult: undefined,
  setTaxonResult: () => {},
})
