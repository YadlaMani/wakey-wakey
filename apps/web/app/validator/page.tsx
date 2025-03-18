"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { toast } from "sonner";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Globe,
  Wallet,
  Activity,
  Clock,
  DollarSign,
  Shield,
  Server,
} from "lucide-react";

interface Validator {
  id: string;
  location: string;
  ip: string;
  pendingPayouts: number;
}

const Page: React.FC = () => {
  const wallet = useWallet();
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [validator, setValidator] = useState<Validator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValidations: 0,
    successRate: 0,
    avgResponseTime: 0,
  });

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
        console.log("Validator info:", res.data.validator);
        toast.success("Welcome validator");
        setValidator(res.data.validator);
        // Simulated stats for demonstration
        setStats({
          totalValidations: 1234,
          successRate: 99.8,
          avgResponseTime: 245,
        });
      }
    } catch (err) {
      toast.error("Failed to send validator info");
      console.error(err);
    } finally {
      setIsLoading(false);
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
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-primary">
              Website Validator
            </h1>
            <p className="text-muted-foreground">
              Connect your wallet to start validating websites and earning
              rewards
            </p>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        </Card>
      </div>
    );
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
                  <p className="text-2xl font-semibold">{stats.successRate}%</p>
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
                    {validator?.pendingPayouts || 0} SOL
                  </p>
                </div>
              </div>
            </Card>
          </div>

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
              <Button onClick={() => toast.success("Validation started")}>
                Start Validation
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Rewards claimed successfully")}
              >
                Claim Rewards
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
