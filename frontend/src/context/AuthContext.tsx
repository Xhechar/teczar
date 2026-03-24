import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserRole } from "../enums/enums";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";
import { AuthService } from "../services/auth.service";
import { FetchUserDto } from "../dtos/dto";

interface AuthContextValue {
  user: FetchUserDto | null | undefined;
  isLoading: boolean;
  setUser: (user: FetchUserDto | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<FetchUserDto | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await AuthService.IsAuthenticated();
      if (result.Success && result.Data) {
        setUserState(result.Data);
      } else {
        setUserState(null);
      }
    } catch {
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMe();
  }, [fetchMe]);

  const setUser = useCallback((u: FetchUserDto | null) => {
    setUserState(u);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await AuthService.LogoutUser();
    setUserState(null);
  }, []);

  const refresh = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};