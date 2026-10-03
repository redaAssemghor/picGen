"use client";
import { useEffect, useRef, useState } from "react";
import { TbStack3 } from "react-icons/tb";
import { useAuth, useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updatePoints } from "../store/featurs/pointsSlice";

import Link from "next/link";

const PointsBtn = () => {
  const [loading, setLoading] = useState(true);

  const { userId, isSignedIn } = useAuth();
  const points = useSelector((state: RootState) => state.points.value);
  const dispatch = useDispatch();

  const handlePopUp = () => {
    const modelId = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modelId) {
      modelId.showModal();
    }
  };

  useEffect(() => {
    const fetchPoints = async () => {
      if (userId) {
        try {
          const response = await fetch("/api/user/getUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
          });
          const data = await response.json();

          if (response.ok) {
            dispatch(updatePoints(data.points));
          } else {
            console.error("Error fetching points:", data.error);
          }
        } catch (error) {
          console.error("Error fetching points:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPoints();
  }, [dispatch, userId]);

  return (
    <div>
      <button
        type="button"
        onClick={handlePopUp} // Fixed typo in function name
        className="flex justify-center items-center gap-1 p-3 rounded-xl bg-[--black]"
      >
        <TbStack3 />
        {loading && isSignedIn ? "Loading..." : `${points} credits`}
      </button>
      {
        <div>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box flex flex-col justify-between lg:h-[600px] lg:w-[400px] overflow-hidden">
              <div>
                <div>
                  <button type="button" aria-label="Close credits dialog" onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement)?.close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Keep creating</h3>
                  <p className="py-4">
                    Explore plans to add more credits to your studio.
                  </p>

                  <Link href="/pricing" className="button button-primary">Explore plans</Link>
                </div>
              </div>

            </div>
          </dialog>
        </div>
      }
    </div>
  );
};

export default PointsBtn;
