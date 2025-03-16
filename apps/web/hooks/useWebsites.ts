import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
interface Website {
  id: string;
  url: string;

  ticks: {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
  }[];
}
export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [error, setError] = useState<string | null>(null);
  async function fetchWebsites() {
    const token = await getToken();

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) setWebsites(response.data.websites);
    else setError(response.data.message);
  }
  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(() => {
      fetchWebsites();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);
  return { websites, error };
}
