"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Upload,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Download,
} from "lucide-react";
import { RecentQuotes } from "@/components/dashboard/recent-quotes";
import { useRouter } from "next/navigation";

export default function QuotesPage() {
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    productName: "",
    productType: "",
    category: "Textiles & Apparel",
    productDescription: "",
    quantity: "",
    targetPrice: "",
    materials: "",
    dimensions: "",
    color: "",
    certifications: "",
    quality: "",
    region: "",
    specifications: "",
    shippingDestination: "",
    deliveryTimeline: "",
    paymentMethod: "",
    sampleRequest: "no",
    openToNegotiation: "yes",
    additionalComments: "",
  });

  const placeholderMap: Record<string, string> = {
    fullName: "Enter your full name",
    companyName: "Enter your company name (optional)",
    email: "Enter your email address",
    phoneNumber: "Enter your phone number (optional)",
    productName: "Enter product name (e.g., Cotton T-Shirts)",
    productType: "Enter type/category (e.g., Apparel, Electronics)",
    category: "Select product category",
    productDescription: "Provide detailed description and specifications",
    quantity: "Enter required quantity (e.g., 500 units)",
    targetPrice: "Target price per unit (optional)",
    materials: "Specify desired materials or components (if applicable)",
    dimensions: "Specify dimensions or size (if applicable)",
    color: "Specify preferred color(s) (if applicable)",
    certifications: "List required certifications (e.g., ISO, CE, FDA)",
    quality: "Describe quality expectations (e.g., grade, durability)",
    shippingDestination: "Enter preferred shipping destination or port",
    deliveryTimeline: "Enter desired delivery timeline (e.g., 30 days)",
    paymentMethod: "Specify preferred payment method (e.g., LC, TT, PayPal)",
    additionalComments: "Add any special instructions or comments",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const router = useRouter(); // 🔁 Add this at the top with other imports

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Please log in first.");

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, String(value).trim());
      }
    });

    uploadedFiles.forEach((file) => data.append("attachments", file));

    try {
      const res = await fetch("http://localhost:8000/quotes/create/", {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
          Accept: "application/json",
        },
        body: data,
      });

      let resultText = await res.text(); // always succeed
      let result;
      try {
        result = JSON.parse(resultText); // try parsing
      } catch {
        result = { detail: resultText }; // fallback to plain text
      }

      if (!res.ok) {
        console.error("Quote create error:", result);
        throw new Error("Failed to create quote");
      }

      alert("Quote submitted successfully");

      // Redirect to filtered suppliers
      const encodedType = encodeURIComponent(formData.productType || "");
      router.push(`/dashboard/suppliers?productType=${encodedType}`);

      setShowNewQuoteForm(false);
      setUploadedFiles([]);
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phoneNumber: "",
        productName: "",
        productType: "",
        category: "",
        productDescription: "",
        quantity: "",
        targetPrice: "",
        materials: "",
        dimensions: "",
        color: "",
        certifications: "",
        quality: "",
        region: "",
        specifications: "",
        shippingDestination: "",
        deliveryTimeline: "",
        paymentMethod: "",
        sampleRequest: "no",
        openToNegotiation: "yes",
        additionalComments: "",
      });
    } catch (err) {
      console.error("Quote submission error:", err);
      alert("There was an error submitting your quote.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-gray-500 mt-1">
            View and manage your quote requests
          </p>
        </div>
        <Button
          onClick={() => setShowNewQuoteForm(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Quote
        </Button>
      </div>

      {showNewQuoteForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-md p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold mb-4">Request a New Quote</h2>

          <Tabs defaultValue="contact">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="product">Product Details</TabsTrigger>
              <TabsTrigger value="quality">Quality & Standards</TabsTrigger>
              <TabsTrigger value="delivery">Delivery & Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-4">
              <Input
                name="fullName"
                placeholder={placeholderMap.fullName}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                name="companyName"
                placeholder={placeholderMap.companyName}
                value={formData.companyName}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder={placeholderMap.email}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phoneNumber"
                placeholder={placeholderMap.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <Input
                name="productName"
                placeholder={placeholderMap.productName}
                value={formData.productName}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Textiles & Apparel">Textiles & Apparel</option>
                  <option value="Steel & Metals">Steel & Metals</option>
                  <option value="Machinery & Equipment">
                    Machinery & Equipment
                  </option>
                  <option value="Electronics & Technology">
                    Electronics & Technology
                  </option>
                  <option value="Furniture & Home Decor">
                    Furniture & Home Decor
                  </option>
                  <option value="Automotive Parts">Automotive Parts</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Chemicals & Materials">
                    Chemicals & Materials
                  </option>
                  <option value="Plastics & Rubber">Plastics & Rubber</option>
                  <option value="Agriculture & Food Processing">
                    Agriculture & Food Processing
                  </option>
                  <option value="Medical & Healthcare">
                    Medical & Healthcare
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                name="productType"
                placeholder={placeholderMap.productType}
                value={formData.productType}
                onChange={handleChange}
                required
              />

              <Textarea
                name="productDescription"
                placeholder={placeholderMap.productDescription}
                value={formData.productDescription}
                onChange={handleChange}
                required
              />
              <Input
                name="region"
                placeholder="Enter sourcing region (e.g., Asia, Europe)"
                value={formData.region}
                onChange={handleChange}
                required
              />
              <Textarea
                name="specifications"
                placeholder="Enter any detailed product specifications"
                value={formData.specifications}
                onChange={handleChange}
                required
              />

              <Input
                name="quantity"
                placeholder={placeholderMap.quantity}
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <Input
                name="targetPrice"
                placeholder={placeholderMap.targetPrice}
                value={formData.targetPrice}
                onChange={handleChange}
              />
              <Input
                name="materials"
                placeholder={placeholderMap.materials}
                value={formData.materials}
                onChange={handleChange}
              />
              <Input
                name="dimensions"
                placeholder={placeholderMap.dimensions}
                value={formData.dimensions}
                onChange={handleChange}
              />
              <Input
                name="color"
                placeholder={placeholderMap.color}
                value={formData.color}
                onChange={handleChange}
              />
              <div>
                <Label>Additional Files</Label>
                <Input type="file" multiple onChange={handleFileUpload} />
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mt-2"
                  >
                    <span>{file.name}</span>
                    <Button variant="ghost" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <Input
                name="certifications"
                placeholder={placeholderMap.certifications}
                value={formData.certifications}
                onChange={handleChange}
              />
              <Textarea
                name="quality"
                placeholder={placeholderMap.quality}
                value={formData.quality}
                onChange={handleChange}
              />
              <div>
                <Label>Sample Request</Label>
                <RadioGroup
                  value={formData.sampleRequest}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, sampleRequest: val }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="sample-yes" value="yes" />
                    <Label htmlFor="sample-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="sample-no" value="no" />
                    <Label htmlFor="sample-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <Input
                name="shippingDestination"
                placeholder={placeholderMap.shippingDestination}
                value={formData.shippingDestination}
                onChange={handleChange}
                required
              />
              <Input
                name="deliveryTimeline"
                placeholder={placeholderMap.deliveryTimeline}
                value={formData.deliveryTimeline}
                onChange={handleChange}
                required
              />
              <Input
                name="paymentMethod"
                placeholder={placeholderMap.paymentMethod}
                value={formData.paymentMethod}
                onChange={handleChange}
              />
              <div>
                <Label>Open to Negotiation?</Label>
                <RadioGroup
                  value={formData.openToNegotiation}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, openToNegotiation: val }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="neg-yes" value="yes" />
                    <Label htmlFor="neg-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="neg-no" value="no" />
                    <Label htmlFor="neg-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <Textarea
                name="additionalComments"
                placeholder={placeholderMap.additionalComments}
                value={formData.additionalComments}
                onChange={handleChange}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit">Submit Quote Request</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full"
                placeholder="Search quotes..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <RecentQuotes />
        </>
      )}
    </div>
  );
}
