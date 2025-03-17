"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, subMinutes } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, ExternalLink } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

function getTimeFrames(ticks: any[]) {
  const frames = Array(10).fill("GRAY");

  const lastTicks = ticks.slice(-10);

  lastTicks.forEach((tick, index) => {
    frames[index] = tick.status === "BAD" ? "BAD" : "GOOD";
  });

  return frames.reverse();
}

function getLatestStatus(ticks: any[]) {
  if (!ticks.length) return "GOOD";
  const sortedTicks = [...ticks].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return sortedTicks[0].status;
}

function getAverageLatency(ticks: any[]) {
  if (!ticks.length) return 0;
  const validTicks = ticks.filter((tick) => tick.status === "GOOD");
  if (!validTicks.length) return 0;
  return Math.round(
    validTicks.reduce((sum, tick) => sum + tick.latency, 0) / validTicks.length
  );
}

export default function Dashboard() {
  const { websites, error, loading, fetchWebsites } = useWebsites();
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getToken } = useAuth();

  async function handleNewWebsite(newWebsiteUrl: string) {
    const token = await getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/create`,
      { url: newWebsiteUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      toast.success("Website created successfully");
      fetchWebsites();
    } else {
      toast.error(response.data.message);
    }
  }

  if (loading) {
    return <Spinner show size="large" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid gap-6">
          {websites.map((website) => {
            const timeFrames = getTimeFrames(website.ticks);
            const currentStatus = getLatestStatus(website.ticks);
            const avgLatency = getAverageLatency(website.ticks);
            const lastTick = website.ticks[0];

            return (
              <Card key={website.id} className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={website.id}>
                    <AccordionTrigger className="px-6 py-4">
                      <div className="flex items-center space-x-4 w-full">
                        <div
                          className={`h-3 w-3 rounded-full ${currentStatus === "GOOD" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <h2 className="text-lg font-medium">{website.url}</h2>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {currentStatus === "GOOD" ? (
                            <span className="text-green-500">Operational</span>
                          ) : (
                            <span className="text-red-500">Down</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last checked{" "}
                          {lastTick
                            ? format(new Date(lastTick.createdAt), "HH:mm:ss")
                            : "Never"}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 pb-6">
                        <h3 className="font-medium">Response Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentStatus === "GOOD"
                            ? `${avgLatency}ms`
                            : "No response"}
                        </p>
                        <div className="flex space-x-1">
                          {timeFrames.map((status, index) => (
                            <div
                              key={index}
                              className={`h-8 w-4 rounded ${
                                status === "GOOD"
                                  ? "bg-green-500"
                                  : status === "BAD"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
