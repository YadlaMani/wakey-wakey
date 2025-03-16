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

function getTimeFrames(ticks: any[], minutes: number = 30) {
  const now = new Date();
  const frames = Array(10)
    .fill(null)
    .map((_, i) => {
      const start = subMinutes(now, minutes * (1 - i / 10));
      const end = subMinutes(now, minutes * (1 - (i + 1) / 10));

      const frameTicks = ticks.filter((tick) => {
        const tickTime = new Date(tick.timestamp);
        return tickTime >= end && tickTime < start;
      });

      return frameTicks.some((tick) => tick.status === "BAD") ? "BAD" : "GOOD";
    });

  return frames;
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
  const { websites, error } = useWebsites();
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-primary">
              Monitoring Dashboard
            </h1>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center space-x-4 w-full">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            currentStatus === "GOOD"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h2 className="text-lg font-medium">
                              {website.url}
                            </h2>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {currentStatus === "GOOD" ? (
                              <span className="text-green-500">
                                Operational
                              </span>
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
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 pb-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Response Time</h3>
                              <p className="text-sm text-muted-foreground">
                                {currentStatus === "GOOD"
                                  ? `${avgLatency}ms`
                                  : "No response"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {timeFrames.map((status, index) => (
                                <div
                                  key={index}
                                  className={`h-8 w-4 rounded ${
                                    status === "GOOD"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Monitoring Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">
                                  Check Frequency
                                </p>
                                <p>Every minute</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Timeframe
                                </p>
                                <p>Last 30 minutes</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Total Checks
                                </p>
                                <p>{website.ticks.length}</p>
                              </div>
                            </div>
                          </div>
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
