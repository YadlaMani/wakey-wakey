"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const params = useParams();
  const websiteId = params?.id;
  const [website, setWebsite] = useState<{
    name?: string;
    url?: string;
  } | null>(null);
  const { getToken } = useAuth();

  async function fetchWebsiteDetails(websiteId: string) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/${websiteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setWebsite(res.data.website);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching website details:", err);
    }
  }

  useEffect(() => {
    if (websiteId) {
      fetchWebsiteDetails(websiteId as string);
    }
  }, [websiteId]);

  return <div>{website ? JSON.stringify(website) : "No website yet"}</div>;
};

export default Page;
