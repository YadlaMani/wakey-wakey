"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Globe2,
  Activity,
  Bell,
  Shield,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background mt-16">
      {/* Hero Section */}
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 relative z-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-6">
              Global Uptime Monitoring,{" "}
              <span className="text-primary">Decentralized</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Monitor your websites from multiple locations worldwide. Get
              instant notifications when issues arise. Trust in a network, not a
              single point of failure.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Start Monitoring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-muted-foreground mb-8">
            Trusted by innovative companies worldwide
          </p>

          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center mb-16 h-8">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg"
              alt="Vercel"
              className="opacity-70 hover:opacity-100 transition-opacity h-[64px] bg-white rounded-lg p-2"
            />

            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg"
              alt="Next.js"
              className="opacity-70 hover:opacity-100 transition-opacity h-[64px] bg-white rounded-lg p-2"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg"
              alt="Solidity"
              className="h-[64px] opacity-70 hover:opacity-100 transition-opacity bg-white rounded-lg p-2"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg"
              alt="Bun"
              className="h-[64px] opacity-70 hover:opacity-100 transition-opacity bg-white rounded-lg p-2"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
              alt="PostgreSQL"
              className="h-[64px] opacity-70 hover:opacity-100 transition-opacity bg-white rounded-lg p-2"
            />
          </div>

          {/* Awards and Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Day
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Week
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Decentralized Monitoring?
            </h2>
            <p className="text-lg text-muted-foreground">
              Reliable, accurate, and truly global website monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe2 className="h-8 w-8" />}
              title="Global Coverage"
              description="Monitor from multiple locations worldwide for accurate uptime data"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8" />}
              title="Real-time Monitoring"
              description="Get instant insights into your website's performance and availability"
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Instant Alerts"
              description="Receive immediate notifications when issues are detected"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Decentralized Security"
              description="No single point of failure in our monitoring infrastructure"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community Powered"
              description="Leverage a network of global nodes for reliable monitoring"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8" />}
              title="Advanced Analytics"
              description="Detailed insights and historical data at your fingertips"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="99.9%" label="Average Uptime" />
            <StatCard number="150+" label="Global Nodes" />
            <StatCard number="10,000+" label="Websites Monitored" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Decentralized Monitoring. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <Card className="p-8">
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </Card>
  );
}
