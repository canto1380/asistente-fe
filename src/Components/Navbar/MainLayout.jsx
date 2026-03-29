import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <main className="flex-1 md:ml-60 p-4 pb-20 md:pb-4 transition-all duration-300">
        <Outlet />
      </main>
    </div>

  );
};

export default MainLayout;