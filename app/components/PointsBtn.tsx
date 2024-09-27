"use client";
import { useEffect, useRef, useState } from "react";
import { TbStack3 } from "react-icons/tb";
import { useAuth, useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updatePoints } from "../store/featurs/pointsSlice";
import Image from "next/image";

const PointsBtn = () => {
  const [loading, setLoading] = useState(true);

  const { userId } = useAuth();
  const points = useSelector((state: RootState) => state.points.value);
  const dispatch = useDispatch();

  const handelPopUp = () => {
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
            body: JSON.stringify({ userId }),
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
  }, [userId]);

  return (
    <div>
      <button
        onClick={handelPopUp}
        className="flex justify-center items-center gap-1 p-2 rounded-xl bg-base-200"
      >
        <TbStack3 />
        {loading
          ? "Loading..."
          : points !== null
          ? `${points} remaining`
          : "No points"}
      </button>

      {
        <div>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box flex flex-col justify-between lg:h-[600px] lg:w-[400px] overflow-hidden">
              <div>
                <form method="dialog">
                  <button className="p-2 border-white border-[0.1px] btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <div>
                  <h3 className="font-bold text-lg">Hello!</h3>
                  <p className="py-4">
                    by clicking on the button below you will get 5 points
                  </p>
                </div>
              </div>
              <div className="-mb-7 -mx-7">
                <Image
                  src={"/robot.webp"}
                  alt="hero"
                  width={402}
                  height={400}
                />
              </div>
            </div>
          </dialog>
        </div>
      }
    </div>
  );
};

export default PointsBtn;
