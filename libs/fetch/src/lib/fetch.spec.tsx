import { render } from '@testing-library/react'

import Fetch from './fetch'

describe('Fetch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Fetch />)
    expect(baseElement).toBeTruthy()
  })
})
