import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TarotTable } from './components/TarotTable';
import { LoadingScreen } from './components/LoadingScreen';

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onLoaded={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <TarotTable />
    </>
  );
}

export default App;
