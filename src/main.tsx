import { createRoot } from 'react-dom/client'
import { Provider } from "./components/ui/provider"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import './index.css'
import App from './App'
import {Toaster} from "./components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <Provider>
      <App />
      <Toaster />
  </Provider>
  ,
)
