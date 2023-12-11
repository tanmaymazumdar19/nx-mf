import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const Org = React.lazy(() => import('org/Module'));

const Team = React.lazy(() => import('team/Module'));

const Poc = React.lazy(() => import('poc/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/org">Org</Link>
        </li>

        <li>
          <Link to="/team">Team</Link>
        </li>

        <li>
          <Link to="/poc">Poc</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="web" />} />

        <Route path="/org" element={<Org />} />

        <Route path="/team" element={<Team />} />

        <Route path="/poc" element={<Poc />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
