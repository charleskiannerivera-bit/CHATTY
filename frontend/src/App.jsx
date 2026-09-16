import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "@clerk/react";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <BrowserRouter>
      <ThemeProvider>
        <WallpaperProvider>
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />
              }
            />
            <Route
              path="/auth"
              element={
                !isSignedIn ? <AuthPage /> : <Navigate to={"/chat"} replace />
              }
            />
          </Routes>
        </WallpaperProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
