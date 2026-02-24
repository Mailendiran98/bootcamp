import Link from "next/link";
import Starfield from "@/components/Starfield";
import { ArrowRight, Activity, CheckCircle2, AlertCircle, Clock, Zap, Menu, Database, LineChart, Share2, Layers, X, Check, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background Glow */}
      <Starfield />

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#05050f]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-lg tracking-tight">PipelinePulse</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
              Start Free
            </Link>
            <button className="md:hidden p-2 text-white/70 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative">
          <div className="container mx-auto max-w-5xl text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              V2.0 Release: Real-time SLA Tracking
              <ArrowRight className="h-3 w-3" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Know Your Data Is Fresh <br className="hidden md:block" />
              <span className="text-gradient">— Before Anyone Else Does</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              A simple, business-friendly dashboard to monitor pipeline health, data freshness, and SLA compliance across your stack.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors flex items-center justify-center gap-2">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="w-full sm:w-auto px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2">
                View Demo Dashboard
              </Link>
            </div>

            {/* Microcopy */}
            <p className="text-sm text-white/40 mb-20 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500/70" />
              Connect in minutes with a single webhook. No infrastructure changes required.
            </p>

            {/* Dashboard Mockup (Visual placeholder) */}
            <div className="relative mx-auto max-w-4xl mt-12">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-transparent to-transparent z-10 top-1/2"></div>
              <div className="rounded-xl border border-white/10 bg-[#0a0a1a] shadow-2xl shadow-purple-900/20 overflow-hidden relative">
                
                {/* Mockup Header */}
                <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto bg-white/5 rounded-md px-3 py-1 text-xs text-white/40 flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    pipelinepulse.com/dashboard
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-8 grid gap-6">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Production Pipelines</h3>
                      <p className="text-sm text-white/50">Last updated: Just now</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> All Systems Operational
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 mb-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-400" /> Successful Runs
                      </div>
                      <div className="text-3xl font-bold">1,432</div>
                      <div className="text-xs text-green-400 mt-2">↑ 12% from yesterday</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 mb-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-400" /> Failed Pipelines
                      </div>
                      <div className="text-3xl font-bold text-red-400">2</div>
                      <div className="text-xs text-white/40 mt-2">Snowflake ETL, dbt Nightly</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 mb-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-400" /> Delayed (SLA Risk)
                      </div>
                      <div className="text-3xl font-bold text-yellow-400">1</div>
                      <div className="text-xs text-white/40 mt-2">Stripe Sync (45m behind)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

            {/* Problem Section */}
            <section className="py-24 relative z-10 border-t border-white/5">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Modern Data Teams <span className="text-gradient">Lack Clear Visibility</span></h2>
                  <p className="text-lg text-white/60 max-w-3xl mx-auto">
                    Today’s pipelines run across multiple tools like Databricks, Snowflake, Airflow, and dbt. Monitoring is fragmented, technical, and difficult to share with stakeholders.
                  </p>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white/[0.02] border-y border-white/5">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">A Unified Status Layer for Your Data Stack</h2>
                  <p className="text-lg text-white/60">One dashboard. One source of truth.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-[#0a0a1a] border border-white/10 rounded-xl p-8">
                    <Layers className="h-8 w-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Unified Dashboard</h3>
                    <p className="text-white/60">Monitor all pipelines from a single, clean interface.</p>
                  </div>
                  <div className="bg-[#0a0a1a] border border-white/10 rounded-xl p-8">
                    <Clock className="h-8 w-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Freshness & SLA Monitoring</h3>
                    <p className="text-white/60">Know instantly when data is stale or a pipeline exceeds its SLA.</p>
                  </div>
                  <div className="bg-[#0a0a1a] border border-white/10 rounded-xl p-8">
                    <Zap className="h-8 w-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Lightweight Integration</h3>
                    <p className="text-white/60">Send a single webhook from your existing pipelines. No refactoring required.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 relative">
              <div className="container mx-auto px-4 max-w-5xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-16">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="w-16 h-16 mx-auto bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-2">Create Workspace</h3>
                    <p className="text-white/60">Sign up and define your pipelines.</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 mx-auto bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-2">Send Events</h3>
                    <p className="text-white/60">Add a webhook call to existing jobs.</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 mx-auto bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-2">Monitor</h3>
                    <p className="text-white/60">View health and SLAs in one place.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white/[0.02] border-y border-white/5">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple Pricing</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="p-8 border border-white/10 rounded-3xl bg-[#0a0a1a]">
                    <h3 className="text-xl font-medium mb-2">Free</h3>
                    <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-white/40">/mo</span></div>
                    <ul className="space-y-4 mb-8 text-white/70">
                      <li className="flex items-center gap-3"><Check className="h-5 w-5 text-purple-500" /> Up to 3 pipelines</li>
                      <li className="flex items-center gap-3"><Check className="h-5 w-5 text-purple-500" /> Basic dashboard</li>
                    </ul>
                    <button className="w-full py-3 px-4 bg-white/5 rounded-xl font-medium transition-colors hover:bg-white/10">Get Started</button>
                  </div>
                  <div className="p-8 border border-purple-500/50 rounded-3xl bg-purple-900/10 relative">
                    <h3 className="text-xl font-medium mb-2 text-purple-400">Pro</h3>
                    <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-white/40">/mo</span></div>
                    <ul className="space-y-4 mb-8 text-white/90">
                      <li className="flex items-center gap-3"><Check className="h-5 w-5 text-purple-500" /> Unlimited pipelines</li>
                      <li className="flex items-center gap-3"><Check className="h-5 w-5 text-purple-500" /> Slack & Webhook alerts</li>
                    </ul>
                    <button className="w-full py-3 px-4 bg-purple-600 rounded-xl font-medium transition-colors hover:bg-purple-500">Start Free Trial</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop discovering data problems <br/><span className="text-gradient">after your dashboards break.</span></h2>
              <p className="text-xl text-white/60 mb-10">Start monitoring proactively with PipelinePulse.</p>
              <Link href="/signup" className="px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors">
                Start Free Today
              </Link>
            </section>
          </main>
          
          {/* Footer */}
          <footer className="py-8 text-center border-t border-white/10 text-white/40 text-sm">
            <p>© 2024 PipelinePulse. All rights reserved.</p>
          </footer>
        </div>
      );
    }
