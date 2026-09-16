import { useClerk } from "@clerk/react";
import { useWallpaper } from "../context/wallpaper";

function ChatPage() {
  const { frameStyle } = useWallpaper();
  const { signOut } = useClerk();

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-border md:flex md:flex-col">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              ✈
            </div>

            <div>
              <h1 className="font-bold">CHATTY</h1>
              <p className="text-xs text-muted-foreground">
                Messages made simple
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your conversations will appear here.
            </p>
          </div>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => signOut()}
              className="w-full rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* Main Landing Area */}
        <main className="relative flex flex-1 items-center justify-center p-6">
          {/* Mobile Logout */}
          <button
            onClick={() => signOut()}
            className="absolute right-4 top-4 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted md:hidden"
          >
            Log out
          </button>

          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-4xl text-primary-foreground shadow-lg">
              ✈
            </div>

            <h2 className="mb-3 text-3xl font-bold">Welcome to CHATTY</h2>

            <p className="text-muted-foreground">
              Your simple and convenient place to connect with people, share
              messages, and stay connected.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              Messaging features are coming soon.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
