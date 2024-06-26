import { createContext } from 'react';
import { TaxonData } from '../request';

export const TaxonDataContext = createContext<{
  taxonData: TaxonData[],
  setTaxonData: (data: TaxonData[]) => void,
}>({
  taxonData: [],
  setTaxonData: () => {},
})
