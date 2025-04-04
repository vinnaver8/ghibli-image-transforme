"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ImageUploader from "@/components/image-uploader"
import PriceSlider from "@/components/price-slider"
import { transformImage } from "@/lib/transform-image"
import { cn } from "@/lib/utils"

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseOutside, setIsMouseOutside] = useState(false)

  // Handle mouse movement for background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        // Check if mouse is outside the main content area
        const mainContent = document.querySelector(".main-content")
        if (mainContent) {
          const rect = mainContent.getBoundingClientRect()
          const isOutside =
            e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom

          setIsMouseOutside(isOutside)
        }

        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleTransform = async () => {
    if (!originalImage) return

    setIsLoading(true)
    try {
      const result = await transformImage(originalImage)
      setTransformedImage(result)
    } catch (error) {
      console.error("Error transforming image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const backgroundStyle = {
    backgroundPosition: `${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%`,
    transition: "all 0.5s ease-out",
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-amber-50 relative overflow-hidden"
      style={backgroundStyle}
    >
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-500 ease-out z-0",
          isMouseOutside ? "opacity-80" : "opacity-20",
        )}
        style={{
          backgroundImage: `url('/images/background.png')`,
          ...backgroundStyle,
        }}
      />

      <div className="max-w-6xl w-full mx-auto z-10 main-content">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4">Ghibli Image Transformer</h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Transform your photos into beautiful Ghibli-style artwork with our AI-powered tool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-amber-100/80 backdrop-blur-sm border-amber-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-amber-800 mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5" /> Upload Your Image
            </h2>
            <ImageUploader onImageUpload={handleImageUpload} />

            {originalImage && (
              <div className="mt-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-amber-300 h-64 bg-white">
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  onClick={handleTransform}
                  className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Transforming...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Transform to Ghibli Style
                    </span>
                  )}
                </Button>
              </div>
            )}
          </Card>

          <Card
            className={cn(
              "p-6 bg-amber-100/80 backdrop-blur-sm border-amber-200 shadow-lg",
              transformedImage ? "flex flex-col" : "flex items-center justify-center",
            )}
          >
            {transformedImage ? (
              <>
                <h2 className="text-2xl font-semibold text-amber-800 mb-4 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" /> Ghibli Transformation
                </h2>
                <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-amber-300 bg-white">
                  <img
                    src={transformedImage || "/placeholder.svg"}
                    alt="Transformed"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  onClick={() => window.open(transformedImage, "_blank")}
                  className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Download Image
                </Button>
              </>
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="h-16 w-16 mx-auto text-amber-400 mb-4" />
                <h3 className="text-xl font-medium text-amber-800 mb-2">Your Ghibli Artwork</h3>
                <p className="text-amber-600">Upload an image and transform it to see the magic happen</p>
              </div>
            )}
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-800 mb-6 text-center">Choose Your Plan</h2>
          <PriceSlider />
        </div>
      </div>
      {isMouseOutside && (
        <>
          <div
            className="absolute w-3 h-3 rounded-full bg-yellow-300/70 animate-float-1 top-1/4 left-1/4"
            style={{ filter: "blur(1px)" }}
          ></div>
          <div
            className="absolute w-2 h-2 rounded-full bg-yellow-200/70 animate-float-2 top-1/3 right-1/3"
            style={{ filter: "blur(1px)" }}
          ></div>
          <div
            className="absolute w-4 h-4 rounded-full bg-yellow-100/70 animate-float-3 bottom-1/4 right-1/4"
            style={{ filter: "blur(1px)" }}
          ></div>
        </>
      )}
    </main>
  )
}

