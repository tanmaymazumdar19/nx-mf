import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

import App from './app/app'

const root: Root = createRoot(document.querySelector('#root') as HTMLElement)
root.render(<App />)
