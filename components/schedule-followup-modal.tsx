"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Clock, Users, Video, Phone, MessageSquare } from "lucide-react"
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

interface ScheduleFollowupModalProps {
  isOpen: boolean
  onClose: () => void
  quoteId: string
}

export function ScheduleFollowupModal({ isOpen, onClose, quoteId }: ScheduleFollowupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    meetingType: "video",
    participants: "",
    agenda: "",
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
      alert("Follow-up meeting scheduled successfully! You'll receive a calendar invitation shortly.")
    }, 1500)
  }

  // Get tomorrow's date in YYYY-MM-DD format for the min attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up Meeting</DialogTitle>
          <DialogDescription>
            Schedule a follow-up meeting with our sourcing team to discuss quote #{quoteId}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={tomorrowFormatted}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time
                </Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Meeting Type</Label>
              <RadioGroup
                value={formData.meetingType}
                onValueChange={(value) => handleRadioChange("meetingType", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chat" id="chat" />
                  <Label htmlFor="chat" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Session
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="participants" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Additional Participants
              </Label>
              <Input
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                placeholder="Email addresses, separated by commas"
              />
              <p className="text-xs text-gray-500">
                Optional: Include team members or colleagues who should join this meeting.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agenda">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                placeholder="Topics you'd like to discuss during the meeting"
                className="min-h-[80px]"
                required
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
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
