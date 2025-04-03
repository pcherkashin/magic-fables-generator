'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input' // Assuming Input component exists
import { Button } from '@/components/ui/button' // Assuming Button component exists

export default function Footer() {
  // TODO: Implement newsletter form functionality if needed
  return (
    <footer className="border-t border-border/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Info Block */}
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Image src="/logo.png" alt="Magic Fables Logo" width={32} height={32} />
              <span className="font-bold">Magic Fables</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered Animated Fairy Tales for Kids
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
            <div className="flex flex-col space-y-3">
              <h4 className="font-medium">Product</h4>
              {/* TODO: Add relevant links */}
              {/* <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link> */}
            </div>
            <div className="flex flex-col space-y-3">
              <h4 className="font-medium">Company</h4>
              {/* TODO: Add relevant links */}
              {/* <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link> */}
              <Link href="https://github.com/pcherkashin/magic-fables-generator" target='_blank' rel='noopener noreferrer' className="text-sm text-muted-foreground hover:text-foreground">GitHub</Link>
            </div>
            <div className="flex flex-col space-y-3">
              <h4 className="font-medium">Legal</h4>
              {/* TODO: Add relevant links */}
              {/* <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link> */}
              {/* <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link> */}
            </div>
          </div>

          {/* Newsletter Form (Optional - adapt if needed) */}
          {/*
          <div className="md:col-span-3 lg:col-span-1">
            <h4 className="font-medium mb-3">Subscribe to our newsletter</h4>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Email address" className="flex-1" />
              <Button type="submit">Join</Button>
            </form>
          </div>
           */}
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          © Magic Fables, {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}