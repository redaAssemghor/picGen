"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { addUser, fetchUser } from "../lib/userApi";
import { useDispatch } from "react-redux";
import { updatePoints } from "../store/featurs/pointsSlice";

const Header = () => {
  const { isSignedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignedIn) addUser(isSignedIn);

    fetchUser().then((data) => {
      dispatch(updatePoints(data.points));
    });
  }, []);

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
