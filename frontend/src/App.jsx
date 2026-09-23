import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useEffect } from "react";

import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuthStore } from "./store/useAuthStore";

import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import PageLoader from "./components/PageLoader.jsx";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      checkAuth();
    } else {
      clearAuth();
    }
  }, [isLoaded, isSignedIn, checkAuth, clearAuth]);

  if (!isLoaded || (isSignedIn && isCheckingAuth)) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <WallpaperProvider>
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn && authUser ? (
                  <ChatPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            <Route
              path="/auth"
              element={isSignedIn ? <Navigate to="/" replace /> : <AuthPage />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WallpaperProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
