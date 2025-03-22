"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { toast } from "sonner";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import {
  MapPin,
  Globe,
  Wallet,
  Activity,
  Clock,
  DollarSign,
  Shield,
  Server,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  InboxIcon,
} from "lucide-react";
import { format } from "date-fns";

interface WebsiteTick {
  id: string;
  websiteId: string;
  website: {
    url: string;
  };
  status: "GOOD" | "BAD";
  latency: number;
  createdAt: string;
}

interface Validator {
  id: string;
  location: string;
  ip: string;
  pendingPayouts: number;
  ticks: WebsiteTick[];
  history: [];
}
interface Tick {
  id: string;
  websiteId: string;
  status: "GOOD" | "BAD";
  latency: number;
}

const Page: React.FC = () => {
  const wallet = useWallet();
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [validator, setValidator] = useState<Validator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [stats, setStats] = useState({
    totalValidations: 0,
    successRate: 0,
    avgResponseTime: 0,
  });

  const socketRef = useRef<WebSocket | null>(null);

  async function fetchIpAndLocation() {
    try {
      const ipRes = await axios.get("https://api64.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;
      setIp(ipAddress);

      const locationRes = await axios.get(
        `https://ipapi.co/${ipAddress}/json/`
      );
      setLocation(`${locationRes.data.city}, ${locationRes.data.country_name}`);
    } catch (error) {
      console.error("Error fetching IP or location:", error);
      toast.error("Failed to fetch location information");
    }
  }

  async function fetchValidatorInfo() {
    if (!wallet.connected || wallet.publicKey === null || !ip || !location)
      return;

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/validator`,
        {
          publicKey: wallet.publicKey.toString(),
          ip,
          location,
        }
      );
      if (res.data.success) {
        toast.success("Welcome validator");
        setValidator(res.data.validator);
        console.log(res.data.validator);

        const ticks = res.data.validator.ticks || [];
        const totalTicks = ticks.length;
        const successfulTicks = ticks.filter(
          (tick: Tick) => tick.status === "GOOD"
        ).length;
        const avgLatency =
          ticks.reduce((sum: number, tick: Tick) => sum + tick.latency, 0) /
            totalTicks || 0;

        setStats({
          totalValidations: totalTicks,
          successRate: totalTicks ? (successfulTicks / totalTicks) * 100 : 0,
          avgResponseTime: Math.round(avgLatency),
        });
      }
    } catch (err) {
      toast.error("Failed to send validator info");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function startValidation() {
    if (!validator) {
      toast.error("Validator data not loaded yet!");
      return;
    }

    if (socketRef.current) {
      toast.info("Validation is already running.");
      return;
    }

    const ws = new WebSocket(`ws://localhost:5050/${validator.id}`);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_validator", id: validator.id }));
      toast.success("Started validation!");
      setValidating(true);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === "validate_website") {
        const websiteId = data.websiteId;

        try {
          const start = Date.now();
          const response = await fetch(data.url, {
            method: "GET",
            mode: "no-cors",
          });

          const latency = Date.now() - start;

          ws.send(
            JSON.stringify({
              type: "validation_result",
              websiteId,
              status: "GOOD",
              latency,
            })
          );
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: "validation_result",
              websiteId,
              status: "BAD",
              latency: 9999,
            })
          );
        }
      }
    };

    ws.onclose = () => {
      setValidating(false);
      socketRef.current = null;
      toast.info("Stopped validation.");
    };
  }

  function stopValidation() {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ type: "leave_validator", id: validator?.id })
      );
      socketRef.current.close();
      socketRef.current = null;
      setValidating(false);
    } else {
      toast.info("Validation is not running.");
    }
  }
  async function withdrawSol() {
    setIsWithdrawing(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/validator/withdraw`,
        {
          validatorId: validator?.id,
        }
      );
      if (res.data.success) {
        toast.message(res.data.message);
        fetchValidatorInfo();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsWithdrawing(false);
    }
  }
  useEffect(() => {
    fetchIpAndLocation();
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      fetchValidatorInfo();
    }
  }, [wallet.connected, ip, location]);

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-2xl font-semibold text-primary">
              Website Validator
            </h1>
            <p className="text-muted-foreground">
              Connect your wallet to start validating websites and earning
              rewards
            </p>
            <WalletMultiButton />
          </div>
        </Card>
      </div>
    );
  }
  function calculateAmountInSol(amount: number | undefined) {
    if (amount === undefined) return 0;
    return (amount / LAMPORTS_PER_SOL).toString();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-primary">
                Validator Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor your validation activities and earnings
              </p>
            </div>
            <WalletMultiButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Validations
                  </p>
                  <p className="text-2xl font-semibold">
                    {stats.totalValidations}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-semibold">
                    {stats.successRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-semibold">
                    {stats.avgResponseTime}ms
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Payout
                  </p>
                  <p className="text-2xl font-semibold">
                    {calculateAmountInSol(validator?.pendingPayouts) || 0} SOL
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="w-full  text-white rounded-lg shadow-lg overflow-hidden">
            <CardHeader className=" border-b border-gray-700">
              <h3 className="text-xl font-semibold">Transaction History</h3>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {validator?.history && validator.history.length > 0 ? (
                validator.history.map((transaction: any, index: number) => (
                  <div
                    key={index}
                    className="w-full  rounded-lg shadow-md p-4 border  hover:border-gray-600"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            Amount:
                          </span>
                          <span className="text-emerald-400 font-mono">
                            {transaction.amount} BTC
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">
                            Signature:
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  transaction.signature
                                )
                              }
                              className="p-1 rounded-md hover:bg-gray-700 transition-colors"
                              title="Copy signature"
                            >
                              <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                            </button>
                            <a
                              href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md hover:bg-gray-700 transition-colors"
                              title="View on Solana Explorer"
                            >
                              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-white" />
                            </a>
                          </div>
                        </div>
                        <div className="font-mono text-xs sm:text-sm p-2 rounded-md overflow-x-auto whitespace-nowrap">
                          {transaction.signature}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400 sm:hidden">
                        {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <InboxIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validator Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Validator Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Validator ID
                    </p>
                    <p className="font-mono">{validator?.id || "Loading..."}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p>{ip || "Loading..."}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{location || "Loading..."}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet</p>
                    <p className="font-mono">
                      {wallet.publicKey?.toString().slice(0, 8)}...
                      {wallet.publicKey?.toString().slice(-8)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Actions</h2>
            <div className="flex space-x-4">
              <Button onClick={validating ? stopValidation : startValidation}>
                {validating ? "Stop Validation" : "Start Validation"}
              </Button>
              <Button variant="outline" onClick={withdrawSol}>
                {isWithdrawing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Withdraw SOL"
                )}
              </Button>
            </div>
          </Card>

          {/* Validation History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Validation History</h2>
            <div className="space-y-4">
              {validator?.ticks && validator.ticks.length > 0 ? (
                validator.ticks
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((tick) => (
                    <div
                      key={tick.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {tick.status === "GOOD" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{tick.websiteId}</p>
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(tick.createdAt),
                              "MMM d, yyyy HH:mm:ss"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tick.latency}ms</p>
                        <p className="text-sm text-muted-foreground">Latency</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No validation history available
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
