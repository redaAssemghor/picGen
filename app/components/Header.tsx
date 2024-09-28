import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="relative z-50 text-[--light]">
      <div className=" flex items-center p-5">
        <div className="flex-1">
          <Link href={"/"} className="text-2xl">
            <Image src="/logo-text.png" alt="logo" width={160} height={160} />
          </Link>
        </div>
        <div>
          <div className="flex items-center">
            <Link href={"/pricing"} className="btn btn-ghost text-lg font-bold">
              Pricing
            </Link>

            <ul className="menu menu-horizontal px-0 text-lg font-bold">
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
    </div>
  );
};

export default Header;
