"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}


export function QuoteModal({ isOpen, onClose, onSubmit }: QuoteModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("product");
  const [shipToDoor, setShipToDoor] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    productName: "",
    productType: "",
    quantity: "",
    region: "",
    color: "",
    targetPrice: "",
    quality: "",
    specifications: "",
    portName: "",
    destinationCountry: "",
    shipmentTerms: "",
    paymentTerms: "",
    shipmentMethod: "sea",
    shipmentDestination: "port",
    doorAddress: "",
    shipmentDetails: "",
  });


  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     const form = new FormData();

    // Add form fields
    for (const key in formData) {
      form.append(key, formData[key as keyof typeof formData]);
    }

    // Add files
    files.forEach((file, index) => {
      form.append("attachments", file); // Django expects a list of files for the same key
    });

    try {
      const response = await fetch("http://localhost:8000/quote/temp-save/", {
        method: "POST",
        body: form,
      });

      const result = await response.json();
      if (response.ok) {
      localStorage.setItem("quoteData", JSON.stringify(formData));
      localStorage.setItem("tempQuoteId", result.temp_quote_id);
      alert("You need to create an account to finalize your quote.");
      onClose();
      router.push(`/auth/signup?email=${encodeURIComponent(formData.email)}&temp_quote_id=${result.temp_quote_id}`);
    } else {
      throw new Error(result.error || "Failed to save quote temporarily");
    }
  } catch (error) {
    console.error("Error submitting quote:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Complete Your Quote Request</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Tabs
            value={activeTab}
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="product">Product Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Information</TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region of Origin</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g. Asia, Europe, North America"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Type of Product</Label>
                  <Input
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    placeholder="e.g. Apparel, Electronics, Furniture"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Red, Blue, Custom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetPrice">Target Price</Label>
                  <Input
                    id="targetPrice"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleChange}
                    placeholder="Your target price per unit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quality</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                >
                  <option value="">Select quality level</option>
                  <option value="best">Best</option>
                  <option value="good">Good</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Enter detailed product specifications"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Samples (Upload Images)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop image files here, or click to select files
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFiles = e.target.files;
                      if (selectedFiles) {
                        setFiles(Array.from(selectedFiles));
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Select Files
                  </Button>
                  {files.length > 0 && (
                    <div className="mt-2 text-sm text-left">
                      {files.map((file, index) => (
                        <p key={index} className="text-gray-600 truncate">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("shipping")}>
                  Next: Shipping Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="portName">Port Name</Label>
                  <Input
                    id="portName"
                    name="portName"
                    value={formData.portName}
                    onChange={handleChange}
                    placeholder="Enter port name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationCountry">
                    Destination Country
                  </Label>
                  <select
                    id="destinationCountry"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                  >
                    <option value="">Select destination country</option>
                    <option value="united_states">United States</option>
                    <option value="canada">Canada</option>
                    <option value="united_kingdom">United Kingdom</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="japan">Japan</option>
                    <option value="china">China</option>
                    <option value="india">India</option>
                    <option value="australia">Australia</option>
                    <option value="brazil">Brazil</option>
                    <option value="south_korea">South Korea</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="netherlands">Netherlands</option>
                    <option value="mexico">Mexico</option>
                    <option value="united_arab_emirates">
                      United Arab Emirates
                    </option>
                    <option value="singapore">Singapore</option>
                    <option value="russia">Russia</option>
                    <option value="south_africa">South Africa</option>
                    <option value="turkey">Turkey</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Shipment Terms</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name="shipmentTerms"
                    value={formData.shipmentTerms}
                    onChange={handleChange}
                  >
                    <option value="">Select shipment terms</option>
                    <option value="fob">FOB (Free On Board)</option>
                    <option value="cif">
                      CIF (Cost, Insurance, and Freight)
                    </option>
                    <option value="exw">EXW (Ex Works)</option>
                    <option value="ddp">DDP (Delivered Duty Paid)</option>
                    <option value="cfr">CFR (Cost and Freight)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                  >
                    <option value="">Select payment terms</option>
                    <option value="tt">T/T (Telegraphic Transfer)</option>
                    <option value="lc">L/C (Letter of Credit)</option>
                    <option value="dp">D/P (Documents against Payment)</option>
                    <option value="da">
                      D/A (Documents against Acceptance)
                    </option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shipment Method</Label>
                <RadioGroup
                  defaultValue="sea"
                  className="flex space-x-4"
                  name="shipmentMethod"
                  value={formData.shipmentMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, shipmentMethod: value }))
                  }
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
                    <RadioGroupItem value="by-land" id="by-land" />
                    <Label htmlFor="by-land">By Land</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Shipment Destination</Label>
                <RadioGroup
                  defaultValue="port"
                  className="flex space-x-4"
                  name="shipmentDestination"
                  value={formData.shipmentDestination}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      shipmentDestination: value,
                    }));
                    setShipToDoor(value === "door");
                  }}
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

              {shipToDoor && (
                <div className="space-y-2">
                  <Label htmlFor="doorAddress">Complete Door Address</Label>
                  <Textarea
                    id="doorAddress"
                    name="doorAddress"
                    value={formData.doorAddress}
                    onChange={handleChange}
                    placeholder="Enter complete delivery address"
                    className="min-h-[80px]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="shipmentDetails">Shipment Details</Label>
                <Textarea
                  id="shipmentDetails"
                  name="shipmentDetails"
                  value={formData.shipmentDetails}
                  onChange={handleChange}
                  placeholder="Enter any additional shipment details or requirements"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("product")}
                >
                  Back to Product Details
                </Button>
                <Button type="submit">Submit Quote Request</Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
