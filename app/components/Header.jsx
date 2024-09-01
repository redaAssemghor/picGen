"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { useEffect } from "react";

const Header = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const addUser = async () => {
      if (isSignedIn) {
        try {
          const response = await fetch("/api/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              points: 60,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to create user");
          }

          const data = await response.json();
          console.log(data.message);
        } catch (error) {
          return console.log(error);
        }
      }
    };
    addUser();
  }, [isSignedIn]);

  return (
    <div className="mx-20">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl">PicGen</a>
        </div>
        <div className="">
          <ul className="menu menu-horizontal px-1">
            {/* <li>
              <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                </ul>
              </details>
            </li> */}

            <li>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
            <li>
              <SignedOut>
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
