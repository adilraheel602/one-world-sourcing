"use client"

import type React from "react"

import { useState } from "react"
import { Package, Truck, Home, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SampleRequestModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  quoteId: string
}

export function SampleRequestModal({ isOpen, onClose, productName, quoteId }: SampleRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    quantity: "1",
    shippingMethod: "express",
    shippingAddress: "",
    specialInstructions: "",
    paymentMethod: "card",
  })
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      // Show success message
      alert("Sample request submitted successfully! Our team will contact you shortly to confirm the details.")
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request Product Samples</DialogTitle>
          <DialogDescription>
            Request physical samples of {productName} to evaluate quality before placing a bulk order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Sample Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500">
                Most suppliers charge for samples. The cost will be communicated to you after submission.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Shipping Method</Label>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(value) => handleRadioChange("shippingMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Express (3-5 days)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Standard (7-10 days)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Shipping Address</Label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="different-address"
                    checked={shipToDifferentAddress}
                    onChange={() => setShipToDifferentAddress(!shipToDifferentAddress)}
                    className="mr-2"
                  />
                  <Label htmlFor="different-address" className="text-sm">
                    Ship to different address
                  </Label>
                </div>
              </div>
              {shipToDifferentAddress ? (
                <Textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Enter complete shipping address"
                  className="min-h-[80px]"
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  <div className="flex items-start">
                    <Home className="h-4 w-4 mr-2 mt-0.5" />
                    <p>123 Commerce St, Suite 400, Los Angeles, CA 90012, USA</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Using your default address from your profile. Check the box above to ship to a different address.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Any specific requirements for the samples"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label>Payment Method for Sample Costs</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleRadioChange("paymentMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card on File
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invoice" id="invoice" />
                  <Label htmlFor="invoice">Invoice Me</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Request Samples
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
