import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
interface AuthProviderProps {
  children: React.ReactNode;
}
const authProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect((): void => {
    if (!isLoggedIn) {
      navigate("/main-menu");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;
  return (
    <div>
      {children}
      <Outlet />
    </div>
  );
};

export default authProvider;
