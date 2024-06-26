import { useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Header from './components/header/Header';
import MultipleSearch from './components/search/MultipleSearch';
import DisplayData from './components/table/DisplayData';
import { TaxonData } from './request';
import { TaxonDataContext } from './context/taxon';

const App: React.FC = () => {
  const [taxonData, setTaxonData] = useState<TaxonData[]>([]);

  return (
    <NextUIProvider locale="zh-CN" className="h-full">
      <main className={"text-foreground bg-background h-full"}>
        <Header />
        <TaxonDataContext.Provider value={{ taxonData, setTaxonData: (data: TaxonData[]) => setTaxonData(data) }}>
          <MultipleSearch />
          <DisplayData className="mt-[10px]" />
        </TaxonDataContext.Provider>
      </main>
    </NextUIProvider>
  );
};

export default App;