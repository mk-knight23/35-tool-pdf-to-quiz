import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useSettingsStore } from './stores/settings'
import { useStatsStore } from './stores/stats'

function initializeApp() {
  const settings = useSettingsStore.getState()
  settings.applyTheme()
  useStatsStore.getState()
}

initializeApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
