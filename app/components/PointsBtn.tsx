"use client";

import { useEffect, useState } from "react";
import { TbStack3 } from "react-icons/tb";
import { useAuth } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updatePoints } from "../store/featurs/pointsSlice";

const PointsBtn = () => {
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const points = useSelector((state: RootState) => state.points.value);
  const dispatch = useDispatch();

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
  }, [userId, dispatch]);

  return (
    <div>
      <button className="flex justify-center items-center gap-1 p-2 rounded-xl bg-base-200">
        <TbStack3 />
        {loading
          ? "Loading..."
          : points !== null
          ? `${points} remaining`
          : "No points"}
      </button>
    </div>
  );
};

export default PointsBtn;
