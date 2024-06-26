import { useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Header from './components/header/Header';
import MultipleSearch from './components/search/MultipleSearch';
import DisplayData from './components/table/DisplayData';
import { TaxonResult } from './request';
import { TaxonDataContext } from './context/taxon';

const App: React.FC = () => {
  const [taxonResult, setTaxonResult] = useState<TaxonResult | undefined>(undefined);

  return (
    <NextUIProvider locale="zh-CN" className="h-full">
      <main className={"text-foreground bg-background h-full"}>
        <Header />
        <TaxonDataContext.Provider value={{ taxonResult, setTaxonResult }}>
          <MultipleSearch />
          <DisplayData />
        </TaxonDataContext.Provider>
      </main>
    </NextUIProvider>
  );
};

export default App;