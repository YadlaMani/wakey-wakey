"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
``;
import { useAuth } from "@clerk/nextjs";
import { jsPDF } from "jspdf";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  CheckCircle,
  XCircle,
  Shield,
  Timer,
  Signal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subHours, differenceInMinutes } from "date-fns";

interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  pendingPayouts: number;
  history: Array<{
    amount: number;
    signature: string;
    timestamp: string;
  }>;
}

interface Tick {
  id: string;
  websiteId: string;
  validatorId: string;
  status: string;
  latency: number;
  createdAt: string;
  validator: Validator;
}

interface Website {
  id: string;
  url: string;
  userId: string;
  disabled: boolean;
  ticks: Tick[];
}

const COLORS = ["#10B981", "#F43F5E", "#F59E0B"];

function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

const Page = () => {
  const params = useParams();
  const websiteId = params?.id;
  const [website, setWebsite] = useState<Website | null>(null);
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
  const handleDownloadPdf = () => {
    if (!website) return;

    const doc = new jsPDF("p", "mm", "a4");

    let yPos = 20;

    doc.setFontSize(22);
    doc.text("Website Monitoring Report", 15, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Website: ${website.url}`, 15, yPos);
    yPos += 10;

    doc.text(
      `Status: ${website.disabled ? "Disabled" : "Operational"}`,
      15,
      yPos
    );
    yPos += 15;

    doc.setFontSize(14);
    doc.text("Key Metrics", 15, yPos);
    yPos += 10;

    const metricsData = [
      ["Average Latency", `${avgLatency}ms`],
      ["Uptime (24h)", `${uptime}%`],
      ["Validator Location", validator?.location || "N/A"],
      ["Total Earnings", `${totalPayout?.toFixed(5)} SOL`],
    ];

    metricsData.forEach(([metric, value]) => {
      doc.text(metric, 15, yPos);
      doc.text(value, 80, yPos);
      yPos += 7;
    });

    yPos += 10;

    doc.setFontSize(14);
    doc.text("Recent Monitoring Checks", 15, yPos);
    yPos += 10;

    const ticksData = last10Ticks.map((tick) => [
      tick.time,
      `${tick.latency}ms`,
      tick.status,
    ]);

    ticksData.forEach(([time, latency, status]) => {
      doc.text(time, 15, yPos);
      doc.text(latency, 60, yPos);
      doc.text(status, 100, yPos);
      yPos += 7;
    });

    yPos += 10;

    doc.setFontSize(14);
    doc.text("Incident History", 15, yPos);
    yPos += 10;

    const incidentsData = incidents
      .reverse()
      .map((incident) => [
        isValidDate(new Date(incident.createdAt))
          ? format(new Date(incident.createdAt), "MMM d, HH:mm:ss")
          : "N/A",
        `${incident.latency}ms`,
        incident.validator.location,
      ]);

    incidentsData.forEach(([time, latency, validatorLocation]) => {
      doc.text(time, 15, yPos);
      doc.text(latency, 60, yPos);
      doc.text(validatorLocation, 100, yPos);
      yPos += 7;
    });

    doc.save(`website_monitor_report_${new Date().toISOString()}.pdf`);
  };

  useEffect(() => {
    if (websiteId) {
      fetchWebsiteDetails(websiteId as string);
    }
  }, [websiteId]);

  if (!website) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const ticks = website.ticks;
  const latencies = ticks.map((tick) => tick.latency);
  const avgLatency = Math.round(
    latencies.reduce((a, b) => a + b, 0) / latencies.length
  );
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);

  const last10Ticks = [...ticks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)
    .reverse()
    .map((tick) => ({
      time: isValidDate(new Date(tick.createdAt))
        ? format(new Date(tick.createdAt), "HH:mm:ss")
        : "N/A",
      latency: tick.latency,
      status: tick.status,
    }));

  const last24Hours = subHours(new Date(), 24);
  const ticksLast24h = ticks.filter(
    (tick) =>
      isValidDate(new Date(tick.createdAt)) &&
      new Date(tick.createdAt) > last24Hours
  );
  const uptime = (
    (ticksLast24h.filter((tick) => tick.status === "GOOD").length /
      ticksLast24h.length) *
    100
  ).toFixed(2);

  const fastResponses = latencies.filter((l) => l < 100).length;
  const mediumResponses = latencies.filter((l) => l >= 100 && l < 500).length;
  const slowResponses = latencies.filter((l) => l >= 500).length;

  const responseDistribution = [
    { name: "Fast (<100ms)", value: fastResponses },
    { name: "Medium (100-500ms)", value: mediumResponses },
    { name: "Slow (>500ms)", value: slowResponses },
  ];

  const validator = ticks[0]?.validator;
  const totalPayout = validator?.history.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  const incidents = ticks.filter((tick) => tick.status !== "GOOD");
  const lastIncident = incidents.length
    ? differenceInMinutes(new Date(), new Date(incidents[0].createdAt))
    : null;

  const recentTicks = ticks.slice(-2);
  const latencyTrend =
    recentTicks.length > 1
      ? recentTicks[1].latency - recentTicks[0].latency
      : 0;

  const availabilityPeriods = ticks.reduce(
    (acc, tick, index, array) => {
      if (index === 0) return acc;
      const prevTick = array[index - 1];
      const timeDiff = differenceInMinutes(
        new Date(tick.createdAt),
        new Date(prevTick.createdAt)
      );
      if (timeDiff > 5) {
        acc.push({
          start: prevTick.createdAt,
          end: tick.createdAt,
          duration: timeDiff,
        });
      }
      return acc;
    },
    [] as Array<{ start: string; end: string; duration: number }>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Website Monitor
            </h1>
            <p className="text-muted-foreground">
              Monitoring status for {website.url}
            </p>
          </div>
          <div>
            <Button variant="outline" onClick={handleDownloadPdf}>
              Download Report
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={website.disabled ? "destructive" : "default"}
              className="text-lg py-2"
            >
              {website.disabled ? "Disabled" : "Operational"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{avgLatency}ms</div>
                <div
                  className={`flex items-center ${latencyTrend <= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {latencyTrend <= 0 ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                  <span className="text-sm">{Math.abs(latencyTrend)}ms</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Range: {minLatency}ms - {maxLatency}ms
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Uptime (24h)
              </CardTitle>
              <Signal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uptime}%</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {lastIncident === null
                    ? "No incidents"
                    : `Last incident: ${lastIncident}m ago`}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validator</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {validator?.location}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate">
                  {validator?.ip}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPayout?.toFixed(5)} SOL
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Last:{" "}
                  {validator?.history[0]?.timestamp
                    ? format(
                        new Date(validator.history[0].timestamp),
                        "MMM d, HH:mm"
                      )
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Response Time Trend</CardTitle>
                  <CardDescription>
                    Latest response times from monitoring checks
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last10Ticks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Distribution</CardTitle>
                  <CardDescription>Breakdown of response times</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={responseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {responseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time Stats</CardTitle>
                  <CardDescription>Detailed latency statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Average
                      </span>
                      <span className="font-medium">{avgLatency}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Minimum
                      </span>
                      <span className="font-medium">{minLatency}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Maximum
                      </span>
                      <span className="font-medium">{maxLatency}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Fast Responses
                      </span>
                      <span className="font-medium">{fastResponses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Slow Responses
                      </span>
                      <span className="font-medium">{slowResponses}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Metrics</CardTitle>
                <CardDescription>
                  Latest monitoring checks and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {ticks
                    .slice(0, 10)
                    .reverse()
                    .map((tick) => (
                      <div
                        key={tick.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {tick.status === "GOOD" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">
                              {isValidDate(new Date(tick.createdAt))
                                ? format(
                                    new Date(tick.createdAt),
                                    "MMM d, HH:mm:ss"
                                  )
                                : "N/A"}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Latency: {tick.latency}ms</span>
                              <span>•</span>
                              <span>Validator: {tick.validator.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              tick.latency < 100
                                ? "default"
                                : tick.latency < 500
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {tick.latency < 100
                              ? "Fast"
                              : tick.latency < 500
                                ? "Medium"
                                : "Slow"}
                          </Badge>
                          <Badge
                            variant={
                              tick.status === "GOOD" ? "default" : "destructive"
                            }
                          >
                            {tick.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Incident History</CardTitle>
                <CardDescription>
                  Showing all detected incidents and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {incidents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No incidents detected
                    </div>
                  ) : (
                    incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="border-l-4 border-red-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">High Latency Detected</p>
                            <p className="text-sm text-muted-foreground">
                              {isValidDate(new Date(incident.createdAt))
                                ? format(
                                    new Date(incident.createdAt),
                                    "MMM d, HH:mm:ss"
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <Badge variant="destructive">
                            {incident.latency}ms
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Response time exceeded threshold at{" "}
                          {incident.validator.location}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Gaps</CardTitle>
                <CardDescription>
                  Periods where monitoring data was not available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {availabilityPeriods.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No monitoring gaps detected
                    </div>
                  ) : (
                    availabilityPeriods.reverse().map((period, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-yellow-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Monitoring Gap Detected
                            </p>
                            <p className="text-sm text-muted-foreground">
                              From:{" "}
                              {isValidDate(new Date(period.start))
                                ? format(
                                    new Date(period.start),
                                    "MMM d, HH:mm:ss"
                                  )
                                : "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              To:{" "}
                              {isValidDate(new Date(period.end))
                                ? format(
                                    new Date(period.end),
                                    "MMM d, HH:mm:ss"
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {period.duration} minutes
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
