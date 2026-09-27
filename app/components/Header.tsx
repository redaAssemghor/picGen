"use client";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  return <header className="site-header">
    <nav className="shell nav-row" aria-label="Main navigation">
      <Link href="/" className="brand" aria-label="Picgen home"><span className="brand-icon"><Sparkles size={19} /></span>picgen<span className="brand-dot">.</span></Link>
      <button type="button" className="mobile-menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      <div id="main-nav" className={`nav-links ${open ? "nav-open" : ""}`} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
        {[{ href: "/generatepage", label: "Create" }, { href: "/images", label: "My library" }, { href: "/pricing", label: "Credits" }].map(link =>
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>
        )}
        {!isLoaded ? <span className="auth-placeholder" aria-label="Loading account" /> : isSignedIn ? <UserButton afterSignOutUrl="/" /> : <div className="nav-auth">
          <SignInButton mode="modal" forceRedirectUrl="/generatepage"><button type="button" className="nav-signin">Sign in</button></SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/generatepage"><button type="button" className="button button-primary">Get started</button></SignUpButton>
        </div>}
      </div>
    </nav>
  </header>;
}
