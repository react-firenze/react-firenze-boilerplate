import React from 'react';
import Loadable from '@react-firenze/react-loadable';
import { fetchCoinPrice } from 'actions/actionCreators';

const routes = [
  {
    component: Loadable({
      loader: () => import('./App'),
      loading: () => <div>Loading...</div>,
    }),
    routes: [
      {
        path: '/',
        exact: true,
        component: Loadable({
          loader: () => import('components/Landing'),
          loading: () => <div>Loading...</div>,
        }),
      },
      {
        path: '/about',
        exact: true,
        component: Loadable({
          loader: () => import('components/About'),
          loading: () => <div>Loading...</div>,
        }),
      },
      {
        path: '/coin',
        exact: true,
        component: Loadable({
          loader: () => import('containers/MainContainer'),
          loading: () => <div>Loading...</div>,
        }),
        fetchData: (store) => store.dispatch(fetchCoinPrice()),
      },
    ],
  },
];

export default routes;
