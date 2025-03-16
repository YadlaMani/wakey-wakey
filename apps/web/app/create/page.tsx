"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
const page = () => {
  const { getToken } = useAuth();
  async function handleNewWebsite(newWebsiteUrl: string) {
    const token = await getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/create`,
      {
        url: newWebsiteUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      toast.success("Website created successfully");
    } else {
      toast.error(response.data.message);
    }
  }
  const [url, setUrl] = useState("");
  return (
    <div>
      <input
        placeholder="enter url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      ></input>
      <button type="button" onClick={() => handleNewWebsite(url)}>
        Create Website
      </button>
    </div>
  );
};

export default page;
