import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { ThemeProvider } from "./context/ThemeContext";

import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import PageLoader from "./components/PageLoader.jsx";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <PageLoader></PageLoader>;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <WallpaperProvider>
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />
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
