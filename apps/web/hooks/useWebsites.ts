"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  pendingPayouts: number;
}

interface WebsiteTick {
  id: string;
  createdAt: string;
  status: "GOOD" | "BAD";
  latency: number;
  validator: Validator;
}

interface Website {
  id: string;
  url: string;
  ticks: WebsiteTick[];
  lastValidator?: Validator | null;
  recentTicks: WebsiteTick[];
  disabled: Boolean;
}

export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWebsites = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token found");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const formattedWebsites = response.data.websites.map(
          (website: any) => ({
            ...website,
            lastValidator:
              website.ticks.length > 0 ? website.ticks[0].validator : null,
            recentTicks: website.ticks.slice(0, 10),
            validators: Array.from(
              new Map(
                website.ticks.map((tick: any) => [
                  tick.validator.id,
                  tick.validator,
                ])
              ).values()
            ),
          })
        );

        setWebsites(formattedWebsites);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch websites");
      console.error("Error fetching websites:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(fetchWebsites, 1000 * 60);
    return () => clearInterval(interval);
  }, [fetchWebsites]);

  return { websites, error, loading, fetchWebsites };
}
