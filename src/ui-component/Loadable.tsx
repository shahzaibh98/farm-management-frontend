import { Suspense } from 'react';

// project imports
import Loader from './Loader';
import { JSX } from 'react/jsx-runtime';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
