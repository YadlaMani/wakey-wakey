"use client";

import { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import SyncUser from "./SyncUser";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Appbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex backdrop-blur-lg bg-white/80 dark:bg-black/50 mx-4 md:mx-24 justify-between items-center px-4 md:px-6 py-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-2 z-50">
      <div className="text-2xl font-bold tracking-tight">
        <Link href="/">Wakey-Wakey</Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-800 dark:text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navigation */}
      <header className="hidden md:flex items-center gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton mode="modal">
            <Button>Get Started</Button>
          </SignUpButton>
        </SignedOut>
        <Link href="/trending" className="text-lg font-semibold">
          Trending
        </Link>

        <SignedIn>
          <SyncUser />
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/validator">Validator</Link>
          </Button>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-black shadow-lg p-4 flex flex-col items-center gap-3 md:hidden">
          <SignedOut>
            <SignInButton />
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <SyncUser />
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/validator">Validator</Link>
            </Button>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>
      )}
    </div>
  );
}
