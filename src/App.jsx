import { AlertProvider } from './context/alertContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppRouter } from './routes/AppRouter.jsx'
import NotificationManager from './Components/Notification/NotificationManager.jsx'

import './index.css'

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <NotificationManager />
        <AppRouter />
      </AuthProvider>
    </AlertProvider>

  )
}

export default App