"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Send, Wand2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const promptRef = useRef(null);

  // Function to handle image generation
  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/imagine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGeneratedImage(data.imageUrl); // Set the generated image base64 string
        console.log(generatedImage);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Client Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle prompt submission
  const handleSubmit = (e) => {
    e.preventDefault();
    generateImage();
  };

  return (
    <div className="top-6 min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Imagine{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Anything
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-400">
            Type your prompt below and watch as AI transforms your words into
            stunning visuals in seconds.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Left Column - Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div className="relative">
                <Textarea
                  ref={promptRef}
                  placeholder="Describe the image you want to create..."
                  className="min-h-[150px] resize-none rounded-xl border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-400 focus:border-cyan-400/50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute bottom-4 right-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 p-2 text-black hover:from-cyan-500 hover:to-violet-600"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Additional form controls */}
              <Button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="mt-2 w-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                Generate Image
              </Button>
            </form>
          </motion.div>

          {/* Right Column - Image Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col space-y-4"
          >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
                  <p className="text-gray-400">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative h-full w-full">
                  <Image
                    src={generatedImage} // Use the base64 image data directly
                    alt="Generated artwork"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                  <ImageIcon className="h-16 w-16 text-gray-600" />
                  <p className="text-gray-400">
                    Your creation will appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
