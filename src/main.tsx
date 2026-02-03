import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router'
import './index.css'
import { useSettingsStore } from './stores/settings'

// Initialize theme on app load
useSettingsStore.getState().applyTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
