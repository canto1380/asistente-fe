import { useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { MENU_ITEMS } from "./menuConfig"
import SidebarDesktop from "./SidebarDesktop"
import MobileTopBar from "./MobileTopBar"
import BottomNav from "./BottomNav"

export const Navbar = () => {
    const { user, logout } = useAuth()
    const location = useLocation()

    const itemsNav = MENU_ITEMS.filter((item) => {
        if (!item.allowedRoles || item.allowedRoles.length === 0) return true
        return item.allowedRoles.includes(user?.role)
    })

    const isActive = (path) => location.pathname === path

    return (
        <>
            <SidebarDesktop isActive={isActive} navItems={itemsNav} logout={logout} user={user} />
            <MobileTopBar logout={logout} />
            <BottomNav isActive={isActive} navItems={itemsNav} logout={logout} />
        </>
    )
}