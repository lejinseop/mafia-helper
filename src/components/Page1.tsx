import React from 'react';
import type { FC } from 'react';
import {
  useLocation,
  UNSAFE_LocationContext,
} from 'react-router-dom-v5-compat';

const RouteTest = React.lazy(() => import('mafia2/RouteTest'));

const Page1: FC = () => {
  const location = useLocation();
  // const location = React.useContext(UNSAFE_LocationContext);
  console.log('host::react-router.v5::location:: ', location);
  return (
    <div>
      Page 1
      <React.Suspense fallback="Loading!~">
        <RouteTest />
      </React.Suspense>
    </div>
  );
};

export default Page1;
