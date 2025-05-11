import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  userRole: string | null;
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  userRole: null,
  isAdmin: false,
  isUser: false,
  isLoading: true,
  isAuthenticated: false,
});

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component cho AuthContext
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState<AuthContextType>({
    userRole: null,
    isAdmin: false,
    isUser: false,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const role = session.user.role || null;

      setAuthState({
        userRole: role,
        isAdmin: role === "admin",
        isUser: role === "user",
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setAuthState({
        userRole: null,
        isAdmin: false,
        isUser: false,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

// Hàm bảo vệ component chỉ cho phép admin truy cập
export function withAdminOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const { isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAdmin) {
        router.push("/");
      }
    }, [isAdmin, isLoading, router]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAdmin) return null;

    return <Component {...props} />;
  };
}

// Hàm bảo vệ component yêu cầu đăng nhập
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}
