"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
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
import { Plus, ExternalLink, Clock, Activity, Server } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

function calculateUptime(ticks: WebsiteTick[]) {
  if (!ticks.length) return 100;
  const totalTicks = ticks.length;
  const goodTicks = ticks.filter((tick) => tick.status === "GOOD").length;
  return Math.round((goodTicks / totalTicks) * 100);
}

function getTimeFrames(ticks: WebsiteTick[]) {
  const frames = Array(24).fill("GRAY");
  const lastTicks = ticks.slice(-24).reverse();
  lastTicks.forEach((tick, index) => {
    frames[index] = tick.status === "BAD" ? "BAD" : "GOOD";
  });
  return frames.reverse();
}
interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  pendingPayouts: number;
}
// interface Website {
//   id: string;
//   url: string;
//   ticks: WebsiteTick[];
//   validators: Validator[];
//   name: string;
//   disabled: boolean;
// }
interface WebsiteTick {
  id: string;
  createdAt: string;
  status: "GOOD" | "BAD";
  latency: number;
  validator: Validator;
}
// interface UseWebsitesReturn {
//   websites: Website[];
//   error: string | null;
//   loading: boolean;
//   fetchWebsites: () => void;
//   lastValidator: Validator | null;
// }
function getLatestStatus(ticks: WebsiteTick[]) {
  if (!ticks.length) return "GOOD";
  const latestTick = ticks[ticks.length - 1];
  return latestTick.status;
}

function getAverageLatency(ticks: WebsiteTick[]) {
  if (!ticks.length) return 0;
  const validTicks = ticks.filter((tick) => tick.status === "GOOD");
  if (!validTicks.length) return 0;
  return Math.round(
    validTicks.reduce((sum, tick) => sum + tick.latency, 0) / validTicks.length
  );
}

function getLatencyTrend(ticks: WebsiteTick[]) {
  const lastTicks = ticks.slice(-5);
  if (lastTicks.length < 2) return "stable";

  const latencies = lastTicks.map((tick) => tick.latency);
  const trend = latencies[latencies.length - 1] - latencies[0];

  if (trend > 50) return "increasing";
  if (trend < -50) return "decreasing";
  return "stable";
}

// function getValidatorInfo(ticks: WebsiteTick[]) {
//   if (!ticks.length) return null;
//   const latestTick = ticks[ticks.length - 1];
//   return latestTick.validator;
// }
interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  pendingPayouts: number;
}

export default function Dashboard() {
  const { websites, error, loading, fetchWebsites } = useWebsites();
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [latencyAlert, setLatencyAlert] = useState(0);
  const { getToken } = useAuth();

  async function handleNewWebsite(newWebsiteUrl: string) {
    const token = await getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/create`,
      { url: newWebsiteUrl, latencyAlert },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      toast.success("Website created successfully");
      fetchWebsites();
    } else {
      toast.error(response.data.message);
    }
  }
  async function toogleWebsiteStatus(websiteId: string) {
    const token = await getToken();
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/toggle/${websiteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Website status toggled successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong while toggling website status");
      console.log(err);
    } finally {
      fetchWebsites();
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Website Monitoring</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Website</DialogTitle>
                <DialogDescription>
                  Enter the URL of the website you want to monitor
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="https://example.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Latency Alert"
                  value={latencyAlert}
                  onChange={(e) => setLatencyAlert(Number(e.target.value))}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleNewWebsite(newWebsiteUrl);
                    setIsDialogOpen(false);
                    setNewWebsiteUrl("");
                  }}
                >
                  Start Monitoring
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6">
          {websites.map((website) => {
            const timeFrames = getTimeFrames(website.ticks);
            const currentStatus = getLatestStatus(website.ticks);
            const avgLatency = getAverageLatency(website.ticks);
            const lastTick = website.ticks[website.ticks.length - 1];
            const uptime = calculateUptime(website.ticks);
            const latencyTrend = getLatencyTrend(website.ticks);

            return (
              <Card key={website.id} className="p-0 overflow-hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value={website.id}>
                    <AccordionTrigger className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 w-full">
                        <div
                          className={`h-3 w-3 rounded-full ${currentStatus === "GOOD" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <h2 className="text-lg font-medium truncate w-40">
                          {website.url}
                        </h2>
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                        <p
                          className={`text-sm font-medium ${currentStatus === "GOOD" ? "text-green-500" : "text-red-500"}`}
                        >
                          {currentStatus === "GOOD" ? "Operational" : "Down"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {lastTick
                              ? formatDistanceToNow(
                                  new Date(lastTick.createdAt),
                                  { addSuffix: true }
                                )
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div>
                            <h3 className="font-medium flex items-center mb-1">
                              <Activity className="h-4 w-4 mr-2" /> Uptime
                            </h3>
                            <p className="text-2xl font-bold">{uptime}%</p>
                            <p className="text-sm text-muted-foreground">
                              Last 24 hours
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Response Time</h3>
                            <p className="text-2xl font-bold">
                              {currentStatus === "GOOD"
                                ? `${avgLatency}ms`
                                : "—"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Trend:{" "}
                              <span
                                className={
                                  latencyTrend === "increasing"
                                    ? "text-red-500"
                                    : latencyTrend === "decreasing"
                                      ? "text-green-500"
                                      : ""
                                }
                              >
                                {latencyTrend}
                              </span>
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium flex items-center mb-1">
                              <Server className="h-4 w-4 mr-2" /> Last Validator
                            </h3>
                            {website.lastValidator ? (
                              <>
                                <p className="text-sm">
                                  {website.lastValidator.location || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {website.lastValidator.ip || "—"}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No data available
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <Button asChild variant="outline">
                            <Link href={`/dashboard/${website.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button
                            variant={
                              website.disabled ? "default" : "destructive"
                            }
                            onClick={() => toogleWebsiteStatus(website.id)}
                          >
                            {website.disabled
                              ? "Enable Monitoring"
                              : "Disable Monitoring"}
                          </Button>
                        </div>
                        <h3 className="font-medium mt-6 mb-2">
                          24-Hour History
                        </h3>
                        <div className="flex space-x-1">
                          {timeFrames.map((status, index) => (
                            <div
                              key={index}
                              className={`h-8 w-4 rounded ${status === "GOOD" ? "bg-green-500" : status === "BAD" ? "bg-red-500" : "bg-gray-400"}`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>24 hours ago</span>
                          <span>Now</span>
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
