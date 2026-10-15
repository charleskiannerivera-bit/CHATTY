import { AuthActionPanel } from "../components/auth/AuthActionPanel";
import AuthHeader from "../components/auth/AuthHeader";
import { AuthHeroPanel } from "../components/auth/AuthHeroPanel";
import { useWallpaper } from "../context/wallpaper";

function AuthPage() {
  const { frameStyle } = useWallpaper();

  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-xl">
        <AuthHeader />

        <main className="relative flex flex-1 flex-col md:flex-row">
          <AuthHeroPanel />

          <section className="flex flex-1 items-center justify-center p-6 sm:p-10 md:p-12">
            <AuthActionPanel />
          </section>
        </main>

        <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
          CHATTY · Made with care by Charles Kianne E. Rivera
        </footer>
      </div>
    </div>
  );
}

export default AuthPage;
