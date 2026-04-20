import React from 'react';
import Home from './pages/Home';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    // SearchProvider wraps the entire tree so any component can
    // read or update the global search state via the useSearch hook.
    <SearchProvider>
      <Home />
    </SearchProvider>
  );
}

export default App;
