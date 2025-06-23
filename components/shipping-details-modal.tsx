"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"
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

interface ShippingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quoteId: string
  currentShippingDetails: {
    portName: string
    destinationCountry: string
    shipmentTerms: string
    paymentTerms: string
    shipmentMethod: string
    shipmentDestination: string
    doorAddress?: string
    shipmentDetails?: string
  }
}

export function ShippingDetailsModal({ isOpen, onClose, quoteId, currentShippingDetails }: ShippingDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    portName: currentShippingDetails.portName,
    destinationCountry: currentShippingDetails.destinationCountry,
    shipmentTerms: currentShippingDetails.shipmentTerms,
    paymentTerms: currentShippingDetails.paymentTerms,
    shipmentMethod: currentShippingDetails.shipmentMethod,
    shipmentDestination: currentShippingDetails.shipmentDestination,
    doorAddress: currentShippingDetails.doorAddress || "",
    shipmentDetails: currentShippingDetails.shipmentDetails || "",
  })

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
      alert("Shipping details updated successfully!")
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Update Shipping Details</DialogTitle>
          <DialogDescription>
            Update the shipping information for quote #{quoteId}. These changes will be reflected in your final order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="portName">Port Name</Label>
                <Input
                  id="portName"
                  name="portName"
                  value={formData.portName}
                  onChange={handleChange}
                  placeholder="Enter port name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destinationCountry">Destination Country</Label>
                <Input
                  id="destinationCountry"
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  placeholder="Enter destination country"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="shipmentTerms">Shipment Terms</Label>
                <select
                  id="shipmentTerms"
                  name="shipmentTerms"
                  value={formData.shipmentTerms}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select shipment terms</option>
                  <option value="FOB">FOB (Free On Board)</option>
                  <option value="CIF">CIF (Cost, Insurance, and Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <select
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select payment terms</option>
                  <option value="30% deposit, 70% before shipping">30% deposit, 70% before shipping</option>
                  <option value="50% deposit, 50% before shipping">50% deposit, 50% before shipping</option>
                  <option value="100% before shipping">100% before shipping</option>
                  <option value="Letter of Credit (L/C)">Letter of Credit (L/C)</option>
                  <option value="Documents against Payment (D/P)">Documents against Payment (D/P)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Shipment Method</Label>
              <RadioGroup
                value={formData.shipmentMethod}
                onValueChange={(value) => handleRadioChange("shipmentMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sea" id="sea" />
                  <Label htmlFor="sea">Sea</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="air" id="air" />
                  <Label htmlFor="air">Air</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">Express</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Shipment Destination</Label>
              <RadioGroup
                value={formData.shipmentDestination}
                onValueChange={(value) => handleRadioChange("shipmentDestination", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="port" id="port" />
                  <Label htmlFor="port">To Port</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="door" id="door" />
                  <Label htmlFor="door">To Door</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.shipmentDestination === "door" && (
              <div className="grid gap-2">
                <Label htmlFor="doorAddress">Complete Door Address</Label>
                <Textarea
                  id="doorAddress"
                  name="doorAddress"
                  value={formData.doorAddress}
                  onChange={handleChange}
                  placeholder="Enter complete delivery address"
                  className="min-h-[80px]"
                  required={formData.shipmentDestination === "door"}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="shipmentDetails">Additional Requirements</Label>
              <Textarea
                id="shipmentDetails"
                name="shipmentDetails"
                value={formData.shipmentDetails}
                onChange={handleChange}
                placeholder="Enter any additional shipment details, timeline requirements, or special instructions"
                className="min-h-[80px]"
              />
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
                  <Save className="h-4 w-4 mr-2" />
                  Update Shipping Details
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
