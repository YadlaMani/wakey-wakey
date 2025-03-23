"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Globe2,
  Activity,
  Bell,
  Shield,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
        console.log(isScrolled);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent -z-10"></div>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center animate-fade-in max-w-3xl mx-auto">
            <div className="mb-6 bg-primary/10 text-primary py-1 px-4 rounded-full text-sm font-medium">
              Decentralized Uptime Monitoring
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Never Sleep on Your Website Again
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              Monitor your websites from multiple locations worldwide with our
              decentralized network of validators. Get instant alerts when
              things go wrong.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start Monitoring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-4xl mx-auto animate-slide-up [animation-delay:300ms] z-1">
            <div className="rounded-lg border shadow-lg overflow-hidden bg-card">
              <div className="p-1 border-b bg-muted/30 flex items-center space-x-2 px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-muted-foreground">
                  Wakey-Wakey Dashboard
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-primary">
                              99.98%
                            </div>
                            <Activity className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Average Uptime
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-primary">
                              124ms
                            </div>
                            <Zap className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Response Time
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-medium">Response Time (24h)</div>
                          <div className="text-xs text-muted-foreground">
                            All times in ms
                          </div>
                        </div>
                        <div className="h-36 relative">
                          <div className="absolute inset-0 flex items-end">
                            {Array.from({ length: 24 }).map((_, i) => {
                              const height = 30 + Math.random() * 70;
                              return (
                                <div
                                  key={i}
                                  className="bg-primary/20 hover:bg-primary/40 transition-colors rounded-t flex-1 mx-0.5"
                                  style={{ height: `${height}%` }}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-full md:w-1/3">
                    <Card className="hover:shadow-md transition-all h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-medium">Sites</div>
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                          {[
                            { name: "example.com", status: "online" },
                            { name: "acme.org", status: "online" },
                            { name: "startup.io", status: "degraded" },
                            { name: "dashboard.app", status: "online" },
                          ].map((site) => (
                            <div
                              key={site.name}
                              className="flex items-center justify-between border-b pb-2 last:border-0"
                            >
                              <div className="font-medium">{site.name}</div>
                              <div
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  site.status === "online"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                )}
                              >
                                {site.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Globe dots */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 -z-10 opacity-40">
          <div className="relative max-w-5xl h-[30vh] mx-auto">
            {[
              { top: "20%", left: "10%", delay: 0.1 },
              { top: "30%", left: "20%", delay: 0.2 },
              { top: "15%", left: "30%", delay: 0.3 },
              { top: "45%", left: "40%", delay: 0.4 },
              { top: "60%", left: "30%", delay: 0.5 },
              { top: "70%", left: "20%", delay: 0.6 },
              { top: "80%", left: "10%", delay: 0.7 },
              { top: "20%", left: "90%", delay: 0.8 },
              { top: "30%", left: "80%", delay: 0.9 },
              { top: "15%", left: "70%", delay: 1.0 },
              { top: "45%", left: "60%", delay: 1.1 },
              { top: "60%", left: "70%", delay: 1.2 },
              { top: "70%", left: "80%", delay: 1.3 },
              { top: "80%", left: "90%", delay: 1.4 },
            ].map((point, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 bg-primary rounded-full opacity-70 animate-pulse"
                style={{
                  top: point.top,
                  left: point.left,
                  animationDelay: `${point.delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-12">
            Trusted by innovative companies worldwide
          </p>

          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center mb-16">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg"
              alt="Vercel"
              className="opacity-70 hover:opacity-100 transition-opacity h-8 md:h-12"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg"
              alt="Prisma"
              className="opacity-70 hover:opacity-100 transition-opacity h-8 md:h-12"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg"
              alt="Solidity"
              className="opacity-70 hover:opacity-100 transition-opacity h-8 md:h-12"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg"
              alt="Bun"
              className="opacity-70 hover:opacity-100 transition-opacity h-8 md:h-12"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
              alt="PostgreSQL"
              className="opacity-70 hover:opacity-100 transition-opacity h-8 md:h-12"
            />
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Day
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Week
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Product of the Month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Decentralized Monitoring?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reliable, accurate, and truly global website monitoring that never
              sleeps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe2 className="h-8 w-8 text-primary" />}
              title="Global Coverage"
              description="Monitor from multiple locations worldwide for accurate uptime data"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-primary" />}
              title="Real-time Monitoring"
              description="Get instant insights into your website's performance and availability"
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-primary" />}
              title="Instant Alerts"
              description="Receive immediate notifications when issues are detected through multiple channels"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Decentralized Security"
              description="No single point of failure in our monitoring infrastructure ensures reliability"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Community Powered"
              description="Leverage a network of global nodes for reliable monitoring at scale"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Advanced Analytics"
              description="Detailed insights and historical data to optimize your website performance"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              How Wakey-Wakey Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A truly decentralized approach to website monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <Card className="h-full">
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Register Your Website
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your website to our platform and configure monitoring
                    preferences.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Easy setup",
                      "Custom intervals",
                      "Multiple endpoints",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <Card className="h-full">
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Global Monitoring
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Our decentralized network of validators checks your website
                    every 3 minutes from multiple locations.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "150+ global nodes",
                      "Trustless validation",
                      "Geographic diversity",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <Card className="h-full">
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Real-time Insights
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get alerts and detailed analytics about your websites
                    performance and availability.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Multi-channel alerts",
                      "Performance trends",
                      "Exportable reports",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Validators Section */}
      <section id="validators" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Become a Validator
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join our network of validators and earn SOL for contributing
                your resources to monitor websites around the globe.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Run a lightweight validator node on your device",
                  "Earn SOL based on your contribution",
                  "Help create a more reliable internet",
                  "Join a community of like-minded individuals",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button>
                Become a Validator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="w-full md:w-1/2">
              <Card className="overflow-hidden">
                <div className="p-1 border-b bg-muted/30 flex items-center space-x-2 px-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-muted-foreground">
                    Validator Terminal
                  </div>
                </div>
                <CardContent className="p-6 bg-black text-green-400 font-mono text-sm">
                  <div className="space-y-2">
                    <div>$ wakey-validator init</div>
                    <div>Initializing validator node...</div>
                    <div>Connected to Wakey-Wakey Hub</div>
                    <div>Validator ID: wakey_val_8a72f...</div>
                    <div>Ready to accept monitoring tasks</div>
                    <div className="flex items-center">
                      <span>Monitoring example.com</span>
                      <span className="animate-pulse ml-1">_</span>
                    </div>
                    <div>Status: Online (200 OK)</div>
                    <div>Response time: 124ms</div>
                    <div>Report submitted, earned 0.001 SOL</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all border-muted">
              <CardContent className="p-6 pt-8">
                <div className="text-lg font-medium mb-2">Free</div>
                <div className="text-3xl font-bold mb-6">
                  $0
                  <span className="text-muted-foreground text-sm font-normal">
                    /month
                  </span>
                </div>
                <div className="border-t border-b py-6 mb-6">
                  <ul className="space-y-4">
                    {[
                      "1 Website",
                      "Checks every 5 minutes",
                      "Email alerts",
                      "24 hour history",
                      "Community support",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all relative border-primary">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <CardContent className="p-6 pt-8">
                <div className="text-lg font-medium mb-2">Pro</div>
                <div className="text-3xl font-bold mb-6">
                  $19
                  <span className="text-muted-foreground text-sm font-normal">
                    /month
                  </span>
                </div>
                <div className="border-t border-b py-6 mb-6">
                  <ul className="space-y-4">
                    {[
                      "10 Websites",
                      "Checks every 3 minutes",
                      "Email & Discord alerts",
                      "90 days history",
                      "API access",
                      "Priority support",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-muted">
              <CardContent className="p-6 pt-8">
                <div className="text-lg font-medium mb-2">Enterprise</div>
                <div className="text-3xl font-bold mb-6">
                  $99
                  <span className="text-muted-foreground text-sm font-normal">
                    /month
                  </span>
                </div>
                <div className="border-t border-b py-6 mb-6">
                  <ul className="space-y-4">
                    {[
                      "Unlimited websites",
                      "Checks every minute",
                      "All alert channels",
                      "1 year history",
                      "Advanced analytics",
                      "Dedicated support",
                      "Custom solutions",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    SLA
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-semibold">W</span>
              </div>
              <span className="font-medium">Wakey-Wakey</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            © 2024 Wakey-Wakey. All rights reserved.
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
    <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}
