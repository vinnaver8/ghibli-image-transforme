"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [isShining, setIsShining] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadToBackend = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://ghibli-backend.vercel.app/transform", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.error("Failed:", await response.text())
        return
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      console.log("Transformed Image URL:", imageUrl)

      // Optional: Show image preview
      const imgWindow = window.open()
      if (imgWindow) {
        imgWindow.document.write(`<img src="${imageUrl}" style="max-width: 100%;" />`)
      }

    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setIsShining(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
    setTimeout(() => setIsShining(false), 500)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadToBackend(e.dataTransfer.files[0])
    }

    setTimeout(() => setIsShining(false), 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadToBackend(e.target.files[0])
    }
    setIsShining(true)
    setTimeout(() => setIsShining(false), 1000)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden",
        isDragging
          ? "border-amber-500 bg-amber-100"
          : "border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-100/50",
        isShining && "shine-effect",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center mb-2">
          <Upload className="h-6 w-6 text-amber-700" />
        </div>
        <p className="text-amber-800 font-medium">Drag and drop your image here</p>
        <p className="text-amber-600 text-sm">or click to browse</p>
        <p className="text-amber-500 text-xs mt-2">Supports JPG, PNG, WEBP (Max 10MB)</p>
      </div>

      {isShining && (
        <>
          <div className="absolute inset-0 pointer-events-none shine-overlay"></div>
          <div
            className="absolute w-2 h-2 rounded-full bg-yellow-200/70 animate-float-1"
            style={{ top: "20%", left: "30%", filter: "blur(1px)" }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-yellow-100/70 animate-float-2"
            style={{ top: "60%", left: "70%", filter: "blur(1px)" }}
          ></div>
        </>
      )}
    </div>
  )
}
