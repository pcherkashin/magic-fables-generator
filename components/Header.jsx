'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button' // Assuming Button component exists and is styled similarly

export default function Header() {
  // TODO: Implement mobile menu functionality if needed
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="Magic Fables Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">
              Magic Fables
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {/* TODO: Add actual navigation links if needed for the generator page */}
            {/* Example:
            <Link
              href="/#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
             */}
          </nav>
        </div>
        {/* TODO: Add mobile menu button if needed */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {/* TODO: Add login/signup or other relevant buttons */}
            {/* Example:
            <Button variant="outline" className="mr-2">Login</Button>
            <Button>Sign Up</Button>
            */}
          </nav>
        </div>
      </div>
    </header>
  )
}