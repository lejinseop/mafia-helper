import React from 'react';
import type { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  CompatRouter,
  CompatRoute,
  Routes,
  Route,
} from 'react-router-dom-v5-compat';
import Page1 from './components/Page1';
import Page2 from './components/Page2';

const RouteTest = React.lazy(() => import('mafia2/RouteTest'));

const App: FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback="loading...">
        <CompatRouter>
          <Routes>
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/route-test" element={<RouteTest />} />
          </Routes>
        </CompatRouter>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
