import { LazyExoticComponent, JSX, Suspense, lazy } from 'react'

import { Button } from 'ui'
import { Link, Route, Routes } from 'react-router-dom'
import NxWelcome from './nx-welcome'

export type LazyComponent = LazyExoticComponent<() => JSX.Element>
export type LazyPayload = Promise<{default: () => JSX.Element}>

function LazyLoadComponent(path: string): LazyComponent {
  return lazy((): LazyPayload => import(path))
}

const Org: LazyComponent = LazyLoadComponent('org/Module')
const Team: LazyComponent = LazyLoadComponent('team/Module')
const Poc: LazyComponent = LazyLoadComponent('poc/Module')

export function App(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>

        <li>
          <Link to='/org'>Org</Link>
        </li>

        <li>
          <Link to='/team'>Team</Link>
        </li>

        <li>
          <Link to='/poc'>Poc</Link>
        </li>
      </ul>
      <Button className='focus:outline-none'>Click me</Button>
      <Button color="blue">Blue</Button>
      <Routes>
        <Route path='/' element={<NxWelcome title='web' />} />

        <Route path='/org' element={<Org />} />

        <Route path='/team' element={<Team />} />

        <Route path='/poc' element={<Poc />} />
      </Routes>
    </Suspense>
  )
}

export default App
