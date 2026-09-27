import Link from "next/link";
export default function Footer() {
  return <footer className="shell site-footer"><div><Link href="/" className="brand">picgen<span className="brand-dot">.</span></Link><p>A little imagination goes a long way.</p></div><div className="footer-links"><Link href="/generatepage">Studio</Link><Link href="/pricing">Pricing</Link><a href="https://portfolio-mocha-eta-22.vercel.app/" target="_blank" rel="noopener noreferrer">Made by Reda</a></div><span className="copyright">© {new Date().getFullYear()} Picgen</span></footer>;
}
