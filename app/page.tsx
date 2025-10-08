"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [todaysPick, setTodaysPick] = useState<any>(null);
  const [siteImages, setSiteImages] = useState<any>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [pickRes, imagesRes] = await Promise.all([
        fetch('/api/picks', { cache: 'no-store' }),
        fetch('/api/site-images', { cache: 'no-store' }),
      ]);

      if (pickRes.ok) {
        setTodaysPick(await pickRes.json());
      }

      if (imagesRes.ok) {
        setSiteImages(await imagesRes.json());
      }
    }

    fetchData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => {
          setContactOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex-1 text-center flex items-center justify-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="System Fifty Logo"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  SYSTEM <span className="text-green-500">FIFTY</span>
                </h1>
                <p className="text-slate-400 mt-2">Premium Sports Betting Analysis</p>
              </div>
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="System Fifty Logo"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elite Picks. Proven Results.
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join the winning team with data-driven analysis and expert picks
            that give you the edge you need.
          </p>
        </section>

        {/* Today's Pick Section */}
        {todaysPick && (
          <section className="max-w-6xl mx-auto mb-16 animate-slide-in-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Today&apos;s Pick
            </h3>
            <div className="flex justify-center">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm ring-2 ring-green-500 w-full md:w-1/3">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded inline-block">
                      ACTIVE
                    </div>
                    <div className="text-sm font-bold text-slate-400 animate-pulse">
                      {new Date(todaysPick.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {todaysPick.title}
                  </h4>
                  {todaysPick.imageUrl && (
                    <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={todaysPick.imageUrl}
                        alt={todaysPick.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">
                    {todaysPick.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Performance Images Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* History */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">{siteImages?.historyTitle || "History"}</h3>
                {siteImages?.historyUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={siteImages.historyUrl}
                      alt={siteImages?.historyTitle || "History"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg bg-slate-900/50 flex items-center justify-center">
                    <p className="text-slate-500">No image uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Graph */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">{siteImages?.lineGraphTitle || "Line Graph"}</h3>
                {siteImages?.lineGraphUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={siteImages.lineGraphUrl}
                      alt={siteImages?.lineGraphTitle || "Line Graph"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg bg-slate-900/50 flex items-center justify-center">
                    <p className="text-slate-500">No image uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ROI */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">{siteImages?.roiTitle || "ROI"}</h3>
                {siteImages?.roiUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={siteImages.roiUrl}
                      alt={siteImages?.roiTitle || "ROI"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg bg-slate-900/50 flex items-center justify-center">
                    <p className="text-slate-500">No image uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16 bg-slate-900/50">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} System Fifty. All rights reserved.</p>
          <p className="text-sm mt-2">Gamble responsibly. Must be 21+.</p>
        </div>
      </footer>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Contact Us</DialogTitle>
          </DialogHeader>
          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="text-xl">Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-slate-200">
                  Name
                </Label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-slate-200">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder="How can we help you?"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
