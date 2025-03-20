"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

export default function SyncUser() {
  const { user } = useUser();
  async function registerUser() {
    if (user) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`,
        {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }
      );
      if (res.data.success) {
        console.log("User registered successfully");
      } else {
        console.log("User registration failed", res.data.message);
      }
    }
  }

  useEffect(() => {
    if (user) {
      registerUser();
    }
  }, [user]);

  return null;
}
