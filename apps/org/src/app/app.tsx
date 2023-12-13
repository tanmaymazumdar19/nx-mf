import type { JSX } from 'react'

import NxWelcome from './nx-welcome'

export default function App(): JSX.Element {
  return (
    <>
      <p>Our Org Tanmay Mazumdar</p>
      <NxWelcome title='org' />
    </>
  )
}
