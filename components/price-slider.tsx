"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PricePlan {
  id: number
  name: string
  price: number
  features: string[]
  popular: boolean
  color: string
}

const plans: PricePlan[] = [
  {
    id: 1,
    name: "Basic",
    price: 9.99,
    features: ["5 image transformations", "Standard quality", "Email support", "Results within 24 hours"],
    popular: false,
    color: "bg-amber-100 border-amber-200",
  },
  {
    id: 2,
    name: "Standard",
    price: 19.99,
    features: [
      "25 image transformations",
      "High quality",
      "Priority email support",
      "Results within 12 hours",
      "Download in multiple formats",
    ],
    popular: true,
    color: "bg-amber-200 border-amber-300",
  },
  {
    id: 3,
    name: "Premium",
    price: 39.99,
    features: [
      "Unlimited transformations",
      "Ultra high quality",
      "24/7 priority support",
      "Instant results",
      "Custom style adjustments",
      "Batch processing",
    ],
    popular: false,
    color: "bg-amber-100 border-amber-200",
  },
]

export default function PriceSlider() {
  const [activeIndex, setActiveIndex] = useState(1)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    if (sliderRef.current) {
      const centerIndex = activeIndex
      const cardWidth = sliderRef.current.offsetWidth / 3
      sliderRef.current.scrollTo({
        left: cardWidth * (centerIndex - 1),
        behavior: "smooth",
      })
    }
  }, [activeIndex])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth / 3
      const scrollPosition = sliderRef.current.scrollLeft
      const newIndex = Math.round(scrollPosition / cardWidth) + 1
      setActiveIndex(Math.max(0, Math.min(newIndex, plans.length - 1)))
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleCardClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="relative overflow-hidden px-4">
      <div
        ref={sliderRef}
        className="flex overflow-x-hidden py-8 px-12 snap-x snap-mandatory"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={cn(
              "flex-shrink-0 w-1/3 px-4 snap-center transition-all duration-300 transform cursor-pointer",
              index === activeIndex ? "scale-105 z-10" : "scale-90 opacity-70",
            )}
            onClick={() => handleCardClick(index)}
          >
            <div
              className={cn(
                "rounded-xl border p-6 shadow-md transition-all duration-300 h-full flex flex-col",
                plan.color,
                plan.popular && "border-amber-500 shadow-amber-200/50",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-amber-900 mb-2">{plan.name}</h3>

              {index === activeIndex && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-amber-800">${plan.price}</span>
                  <span className="text-amber-700">/month</span>
                </div>
              )}

              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-amber-800 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full mt-auto",
                  plan.popular
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-200 hover:bg-amber-300 text-amber-900",
                )}
              >
                Choose Plan
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {plans.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "bg-amber-600 w-4" : "bg-amber-300",
            )}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

