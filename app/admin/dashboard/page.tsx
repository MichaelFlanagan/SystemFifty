"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Pick = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

type SiteImages = {
  id: string;
  historyUrl: string | null;
  historyTitle: string | null;
  lineGraphUrl: string | null;
  lineGraphTitle: string | null;
  roiUrl: string | null;
  roiTitle: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pick, setPick] = useState<Pick | null>(null);
  const [siteImages, setSiteImages] = useState<SiteImages | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  // Pick form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Site images state
  const [historyFile, setHistoryFile] = useState<File | null>(null);
  const [historyTitle, setHistoryTitle] = useState("");
  const [lineGraphFile, setLineGraphFile] = useState<File | null>(null);
  const [lineGraphTitle, setLineGraphTitle] = useState("");
  const [roiFile, setRoiFile] = useState<File | null>(null);
  const [roiTitle, setRoiTitle] = useState("");
  const [uploadingSiteImage, setUploadingSiteImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pickRes, imagesRes] = await Promise.all([
        fetch("/api/picks"),
        fetch("/api/site-images"),
      ]);

      if (pickRes.ok) {
        const pickData = await pickRes.json();
        setPick(pickData);
        if (pickData) {
          setTitle(pickData.title);
          setContent(pickData.content);
        }
      }

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setSiteImages(imagesData);
        if (imagesData) {
          setHistoryTitle(imagesData.historyTitle || "History");
          setLineGraphTitle(imagesData.lineGraphTitle || "Line Graph");
          setRoiTitle(imagesData.roiTitle || "ROI");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = pick?.imageUrl || null;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
          console.log("Image uploaded successfully:", url);
        } else {
          const error = await uploadRes.json();
          console.error("Upload failed:", uploadRes.status, error);
          alert(`Upload failed: ${error.error || 'Unknown error'}`);
          return;
        }
      }

      // Update or create pick
      const pickData = {
        title,
        content,
        imageUrl,
      };

      let pickRes;
      if (pick) {
        console.log("Updating pick:", pickData);
        pickRes = await fetch(`/api/picks/${pick.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pickData),
        });
      } else {
        console.log("Creating pick:", pickData);
        pickRes = await fetch("/api/picks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pickData),
        });
      }

      if (pickRes.ok) {
        console.log("Pick saved successfully");
        setImageFile(null);
        setImagePreview(null);
        fetchData();
      } else {
        const error = await pickRes.json();
        console.error("Failed to save pick:", error);
        alert(`Failed to save pick: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to save pick:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleUpdate = async (type: 'history' | 'lineGraph' | 'roi') => {
    try {
      const updateData: any = {};
      if (type === 'history') updateData.historyTitle = historyTitle;
      if (type === 'lineGraph') updateData.lineGraphTitle = lineGraphTitle;
      if (type === 'roi') updateData.roiTitle = roiTitle;

      const updateRes = await fetch("/api/site-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (updateRes.ok) {
        console.log(`Title (${type}) saved to database`);
        fetchData();
      } else {
        const error = await updateRes.json();
        console.error(`Failed to save title (${type}):`, error);
        alert(`Failed to save title: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const handleSiteImageUpload = async (type: 'history' | 'lineGraph' | 'roi', file: File) => {
    setUploadingSiteImage(type);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        console.log(`Site image (${type}) uploaded successfully:`, url);

        const updateData: any = {};
        if (type === 'history') updateData.historyUrl = url;
        if (type === 'lineGraph') updateData.lineGraphUrl = url;
        if (type === 'roi') updateData.roiUrl = url;

        const updateRes = await fetch("/api/site-images", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (updateRes.ok) {
          console.log(`Site image (${type}) saved to database`);
        } else {
          const error = await updateRes.json();
          console.error(`Failed to save site image (${type}):`, error);
          alert(`Failed to save image: ${error.error || 'Unknown error'}`);
        }

        fetchData();
      } else {
        const error = await uploadRes.json();
        console.error("Site image upload failed:", uploadRes.status, error);
        alert(`Upload failed: ${error.error || 'Unknown error'}`);
      }

      // Reset file inputs
      if (type === 'history') setHistoryFile(null);
      if (type === 'lineGraph') setLineGraphFile(null);
      if (type === 'roi') setRoiFile(null);
    } catch (error) {
      console.error("Failed to upload site image:", error);
    } finally {
      setUploadingSiteImage(null);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            SYSTEM <span className="text-green-500">FIFTY</span> - Admin
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Today's Pick */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Today&apos;s Pick</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Today's Best Bet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-200">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Lakers vs Warriors&#10;Pick: Lakers -5.5&#10;&#10;Analysis: ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-200">
                    Image (Optional)
                  </Label>
                  {pick?.imageUrl && !imagePreview && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                      <Image
                        src={pick.imageUrl}
                        alt="Current"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                  {imagePreview && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : pick ? "Update Pick" : "Create Pick"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Site Images */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Site Images</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {/* History */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {siteImages?.historyUrl && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={siteImages.historyUrl}
                        alt="History"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="history-title" className="text-slate-200">
                      Title
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="history-title"
                        value={historyTitle}
                        onChange={(e) => setHistoryTitle(e.target.value)}
                        className="bg-slate-900/50 border-slate-700 text-white"
                        placeholder="History"
                      />
                      <Button
                        onClick={() => handleTitleUpdate('history')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="history-image" className="text-slate-200">
                      Image
                    </Label>
                    <Input
                      id="history-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setHistoryFile(file);
                          handleSiteImageUpload('history', file);
                        }
                      }}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      disabled={uploadingSiteImage === 'history'}
                    />
                    {uploadingSiteImage === 'history' && (
                      <p className="text-sm text-slate-400">Uploading...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Line Graph */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Line Graph</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {siteImages?.lineGraphUrl && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={siteImages.lineGraphUrl}
                        alt="Line Graph"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="linegraph-title" className="text-slate-200">
                      Title
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="linegraph-title"
                        value={lineGraphTitle}
                        onChange={(e) => setLineGraphTitle(e.target.value)}
                        className="bg-slate-900/50 border-slate-700 text-white"
                        placeholder="Line Graph"
                      />
                      <Button
                        onClick={() => handleTitleUpdate('lineGraph')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linegraph-image" className="text-slate-200">
                      Image
                    </Label>
                    <Input
                      id="linegraph-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLineGraphFile(file);
                          handleSiteImageUpload('lineGraph', file);
                        }
                      }}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      disabled={uploadingSiteImage === 'lineGraph'}
                    />
                    {uploadingSiteImage === 'lineGraph' && (
                      <p className="text-sm text-slate-400">Uploading...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ROI */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">ROI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {siteImages?.roiUrl && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={siteImages.roiUrl}
                        alt="ROI"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="roi-title" className="text-slate-200">
                      Title
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="roi-title"
                        value={roiTitle}
                        onChange={(e) => setRoiTitle(e.target.value)}
                        className="bg-slate-900/50 border-slate-700 text-white"
                        placeholder="ROI"
                      />
                      <Button
                        onClick={() => handleTitleUpdate('roi')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roi-image" className="text-slate-200">
                      Image
                    </Label>
                    <Input
                      id="roi-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setRoiFile(file);
                          handleSiteImageUpload('roi', file);
                        }
                      }}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      disabled={uploadingSiteImage === 'roi'}
                    />
                    {uploadingSiteImage === 'roi' && (
                      <p className="text-sm text-slate-400">Uploading...</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
