"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const CreateUser = () => {
  const { isSignedIn } = useAuth(); // Use useAuth to check if the user is signed in

  useEffect(() => {
    // Call the API to create the user if the user is signed in
    const createUser = async () => {
      if (isSignedIn) {
        try {
          const response = await fetch("/api/updatePoints", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ points: 100 }),
          });

          if (!response.ok) {
            throw new Error("Failed to create user");
          }

          const data = await response.json();
          console.log(data.message); // User created successfully
        } catch (error) {
          console.error(error);
        }
      }
    };

    createUser();
  }, [isSignedIn]);

  return null; // This component doesn't render anything
};

export default CreateUser;
