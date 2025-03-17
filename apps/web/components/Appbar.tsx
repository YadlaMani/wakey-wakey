import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
export function Appbar() {
  return (
    <div className="flex backdrop-blur-lg bg-white/30 mx-12 justify-between items-center px-4 py-4 rounded-2xl shadow-lg border border-gray-800 sticky top-2 z-10">
      <div className="text-2xl font-bold  tracking-tight">Wakey-Wakey</div>

      <header className="flex items-center gap-4">
        <ModeToggle />
        <SignedOut>
          <div className="font-bold cursor-pointer">
            <SignInButton />
          </div>
          <div className="bg-[#181818] text-white px-5 py-2 font-bold rounded-lg shadow-md hover:bg-[#222] active:scale-95 transition">
            <SignUpButton mode="modal">Get Started</SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
}
