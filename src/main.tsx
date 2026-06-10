import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UnitPreferenceProvider } from './hooks/useUnitPreference.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnitPreferenceProvider>
      <App />
    </UnitPreferenceProvider>
  </StrictMode>,
)
