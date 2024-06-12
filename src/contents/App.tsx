import { NextUIProvider } from '@nextui-org/react';
import Header from './components/header/Header';
import MultipleSearch from './components/search/MultipleSearch';

const App: React.FC = () => {

  return (
    <NextUIProvider className="h-full">
      <main className={"text-foreground bg-background h-full"}>
        <Header />
        <MultipleSearch />
      </main>
    </NextUIProvider>
  );
};

export default App;