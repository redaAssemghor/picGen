import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  return (
    <div className="mx-20 rounded-b-full z-50">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-2xl">
            PicGen
          </Link>
        </div>
        <div className="">
          <ul className="menu menu-horizontal px-1">
            <li>
              <SignedIn>
                {/* Show user options when signed in */}
                <UserButton />
              </SignedIn>
            </li>
            <li>
              <SignedOut>
                {/* This button will redirect to Clerk's default sign-in page */}
                <SignInButton />
              </SignedOut>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
