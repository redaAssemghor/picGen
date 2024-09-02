export const addUser = async (isSignedIn: boolean) => {
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

export const fetchUser = async () => {
  try {
    const res = await fetch("/api/points");

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const updateUserPoints = async (points: number) => {
  try {
    const res = await fetch("/api/decrementPoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ points }),
    });

    if (!res.ok) {
      console.error("Failed to decrement points:", await res.json());
    } else {
      const data = await res.json();
      console.log("the data.points", data.points);
      return data.points;
    }
  } catch (error) {
    console.log(error);
  }
};
