import { useNavigate, useLocation } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
  };
}

// Get current pathname from React Router
export function usePathname() {
  const location = useLocation();
  return location.pathname;
}


