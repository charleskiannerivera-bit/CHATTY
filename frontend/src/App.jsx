import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "@clerk/react";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Set this to true when ChatPage is ready
  const chatPageReady = false;

  return (
    <BrowserRouter>
      <ThemeProvider>
        <WallpaperProvider>
          <Routes>
            <Route
              path="/"
              element={
                chatPageReady && isSignedIn ? <ChatPage /> : <AuthPage />
              }
            />

            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </WallpaperProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
