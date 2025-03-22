"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const page = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "u2872207-4d4fa199ac93d02b768ceefc";
  async function fetchTrending() {
    try {
      const res = await axios.post("/api/proxy");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while fetching trending websites");
    }
  }

  useEffect(() => {
    fetchTrending();
  }, []);
  return <div>page</div>;
};

export default page;
