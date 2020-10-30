import React from 'react';
import { hot } from 'react-hot-loader/root';
import { createHashHistory } from 'history';
import { Router } from 'react-router-dom';
import Routes from './Routes';
import SuspensionRoutes from '../suspension/containers/Routes';

const history = createHashHistory();
function useQuery() {
  return new URLSearchParams(window.location.search);
}
const Root = () => {
  const query = useQuery();
  const children =
    query.get('suspension') === '1' ? <SuspensionRoutes /> : <Routes />;

  return <Router history={history}>{children}</Router>;
};

export default hot(Root);
