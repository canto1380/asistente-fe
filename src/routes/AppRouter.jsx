import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicRoutes } from './PublicRoutes.jsx'
import { PrivateRoutes } from './PrivateRoutes.jsx'
import { ProtectedRoutes } from './ProtectedRoutes.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import InicioPage from '../pages/InicioPage.jsx'
import EventosPage from '../pages/EventosPage.jsx'
import TareasPage from '../pages/TareasPage.jsx'
import GastosPage from '../pages/GastosPage.jsx'
import MainLayout from '../Components/Navbar/MainLayout.jsx'
import RecordatoriosPage from '../pages/RecordatoriosPage.jsx'

export const AppRouter = () => {
    const estaConectado = navigator.isOnline

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                </Route>

                <Route element={<PrivateRoutes />}>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<InicioPage />} />
                        <Route element={<PrivateRoutes requiredRole={['ADMIN', 'ADMINEMPRESA']} />}>
                            <Route path='/eventos' element={<EventosPage />} />
                        </Route>
                        <Route element={<PrivateRoutes requiredRole={['ADMIN', 'ADMINEMPRESA']} />}>
                            <Route path='/tareas' element={<TareasPage />} />
                        </Route>

                        <Route element={<PrivateRoutes requiredRole={['ADMIN', 'ADMINEMPRESA']} />}>
                            <Route path='/recordatorios' element={<RecordatoriosPage />} />
                        </Route>
                        
                        <Route element={<PrivateRoutes requiredRole={['ADMIN', 'ADMINEMPRESA']} />}>
                            <Route path='/gastos' element={<GastosPage />} />
                        </Route>


                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}