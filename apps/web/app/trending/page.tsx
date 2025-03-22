"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trendingWebsites } from "@/consts/trendingWebsites";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
} from "recharts";

interface Site {
  name: string;
  url: string;
  category?: string;
  latency?: number;
}

const categories = [
  "All",
  "Search Engine",
  "Social Media",
  "E-commerce",
  "News",
  "Banking",
  "Entertainment",
  "Utility",
];

const categorizedWebsites = trendingWebsites.map((site: Site) => ({
  ...site,
  category:
    site.name.includes("Google") || site.name.includes("Bing")
      ? "Search Engine"
      : site.name.includes("Facebook") ||
          site.name.includes("Instagram") ||
          site.name.includes("X") ||
          site.name.includes("Reddit") ||
          site.name.includes("LinkedIn")
        ? "Social Media"
        : site.name.includes("Flipkart") ||
            site.name.includes("Amazon") ||
            site.name.includes("Myntra") ||
            site.name.includes("Paytm")
          ? "E-commerce"
          : site.name.includes("Times") ||
              site.name.includes("News") ||
              site.name.includes("Express") ||
              site.name.includes("Hindustan")
            ? "News"
            : site.name.includes("SBI") || site.name.includes("HDFC")
              ? "Banking"
              : site.name.includes("Netflix") ||
                  site.name.includes("Hotstar") ||
                  site.name.includes("BookMyShow")
                ? "Entertainment"
                : "Utility",
}));

const getColor = (latency?: number) => {
  if (!latency) return "text-gray-400";
  return latency < 500
    ? "text-green-400"
    : latency < 1500
      ? "text-yellow-400"
      : "text-red-400";
};

const Page = () => {
  const [websitesLatency, setWebsitesLatency] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function fetchLatency() {
    setLoading(true);
    const results = await Promise.all(
      categorizedWebsites.map(async (site) => {
        const start = performance.now();
        try {
          await fetch(site.url, { mode: "no-cors" });
        } catch (error) {
          console.error(`Error fetching ${site.url}:`, error);
        }
        const latency = performance.now() - start;
        return { ...site, latency: Math.round(latency) };
      })
    );
    setWebsitesLatency(results);
    setLoading(false);
    toast.success("Latency data fetched successfully");
  }

  useEffect(() => {
    fetchLatency();
  }, []);

  const filteredWebsites =
    selectedCategory === "All"
      ? websitesLatency
      : websitesLatency.filter((site) => site.category === selectedCategory);

  const averageLatency =
    filteredWebsites.length > 0
      ? (
          filteredWebsites.reduce((acc, site) => acc + (site.latency || 0), 0) /
          filteredWebsites.length
        ).toFixed(2)
      : 0;

  return (
    <div className="p-8 min-h-screen flex flex-col items-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Indian Website Monitor</h1>
      <Select onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-60 mb-4 bg-gray-900 border-gray-700 text-white">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 text-white">
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={fetchLatency}
        className="mt-6 bg-white text-black hover:bg-gray-300"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Refresh Latency"}
      </Button>

      <p className="text-lg font-semibold my-4">
        Average Latency: {averageLatency} ms
      </p>
      <div className="w-full max-w-5xl h-64 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredWebsites}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" tick={{ fill: "#fff" }} hide />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip
              formatter={(value, name, props) => [
                `Latency: ${value} ms`,
                props.payload.name,
              ]}
            />
            <Bar dataKey="latency" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading &&
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-800" />
          ))}
        {filteredWebsites.map((site) => (
          <Card
            key={site.url}
            className="p-4 flex justify-between bg-gray-900 border-gray-700"
          >
            <div>
              <p className="text-lg font-semibold">{site.name}</p>
              <p className="text-sm text-gray-400">{site.category}</p>
            </div>
            <p className={`text-xl font-bold ${getColor(site.latency)}`}>
              {site.latency} ms
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
