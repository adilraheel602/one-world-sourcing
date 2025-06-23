"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  Building,
  User,
  Package,
  FileText,
  Globe,
} from "lucide-react";

interface FormData {
  // Company Information
  companyName: string;
  country: string;
  city: string;
  establishedYear: string;
  website: string;

  // Primary Contact Details
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;

  // Product & Business Details
  productCategories: string[];
  productDescription: string;
  monthlyCapacity: string;
  minimumOrderQuantity: string;
  currentlyExports: string;
  exportMarkets: string;
  portOfLoading: string;

  // Certifications & Documentation
  certifications: string[];
  companyDocument: File | null;
  productCatalog: File | null;
  samplePhotos: File[];

  // Additional Info
  internationalExperience: string;
  additionalNotes: string;

  // Consent
  accuracyConfirmed: boolean;
  termsAgreed: boolean;
}

const productCategoryOptions = [
  "Textiles & Apparel",
  "Steel & Metals",
  "Machinery & Equipment",
  "Electronics & Technology",
  "Furniture & Home Decor",
  "Automotive Parts",
  "Food & Beverages",
  "Chemicals & Materials",
  "Plastics & Rubber",
  "Agriculture & Food Processing",
  "Medical & Healthcare",
  "Other",
];

const certificationOptions = [
  "ISO 9001 (Quality Management)",
  "ISO 14001 (Environmental Management)",
  "CE Marking",
  "GOTS (Global Organic Textile Standard)",
  "BSCI (Business Social Compliance Initiative)",
  "WRAP (Worldwide Responsible Accredited Production)",
  "OEKO-TEX Standards",
  "FDA Approved",
  "GMP (Good Manufacturing Practice)",
  "Other",
];

const countries = [
  "China",
  "India",
  "Pakistan",
  "Bangladesh",
  "Vietnam",
  "Turkey",
  "Thailand",
  "Indonesia",
  "South Korea",
  "Taiwan",
  "Malaysia",
  "Philippines",
  "Sri Lanka",
  "Myanmar",
  "Cambodia",
  "Other",
];

export default function SupplierRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    country: "",
    city: "",
    establishedYear: "",
    website: "",
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    productCategories: [],
    productDescription: "",
    monthlyCapacity: "",
    minimumOrderQuantity: "",
    currentlyExports: "",
    exportMarkets: "",
    portOfLoading: "",
    certifications: [],
    companyDocument: null,
    productCatalog: null,
    samplePhotos: [],
    internationalExperience: "",
    additionalNotes: "",
    accuracyConfirmed: false,
    termsAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleArrayValue = (
    field: "productCategories" | "certifications",
    value: string
  ) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const handleFileUpload = (
    field: "companyDocument" | "productCatalog",
    file: File
  ) => {
    updateFormData(field, file);
  };

  const handleMultipleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    updateFormData("samplePhotos", [...formData.samplePhotos, ...fileArray]);
  };

  const removeFile = (field: "samplePhotos", index: number) => {
    const newFiles = formData.samplePhotos.filter((_, i) => i !== index);
    updateFormData(field, newFiles);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.companyName.trim())
          newErrors.companyName = "Company name is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.establishedYear.trim())
          newErrors.establishedYear = "Established year is required";
        break;

      case 2:
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.jobTitle.trim())
          newErrors.jobTitle = "Job title is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim())
          newErrors.phone = "Phone number is required";
        break;

      case 3:
        if (formData.productCategories.length === 0)
          newErrors.productCategories = "Select at least one product category";
        if (!formData.productDescription.trim())
          newErrors.productDescription = "Product description is required";
        if (!formData.monthlyCapacity.trim())
          newErrors.monthlyCapacity = "Monthly capacity is required";
        if (!formData.minimumOrderQuantity.trim())
          newErrors.minimumOrderQuantity = "MOQ is required";
        if (!formData.currentlyExports)
          newErrors.currentlyExports = "Please select yes or no";
        break;

      case 5:
        if (!formData.accuracyConfirmed)
          newErrors.accuracyConfirmed = "Please confirm accuracy";
        if (!formData.termsAgreed)
          newErrors.termsAgreed = "Please agree to terms";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);

    try {
      // Get JWT token with correct key
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("Please login first to register as a supplier.");
        window.location.href = "/login";
        return;
      }

      // Check if we need to send as FormData (for file uploads) or JSON
      let requestBody;
      let headers: Record<string, string> = {
        Authorization: `JWT ${accessToken}`,
      };

      // If there are files, use FormData
      if (
        formData.companyDocument ||
        formData.productCatalog ||
        formData.samplePhotos.length > 0
      ) {
        const submitData = new FormData();

        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "samplePhotos") {
            formData.samplePhotos.forEach((file, index) => {
              submitData.append(`samplePhotos`, file); // Don't use array notation
            });
          } else if (key === "companyDocument" || key === "productCatalog") {
            if (value) submitData.append(key, value as File);
          } else if (Array.isArray(value)) {
            // Send arrays as JSON strings or individual entries
            value.forEach((item) => submitData.append(`${key}[]`, item));
          } else if (typeof value === "boolean") {
            submitData.append(key, value.toString());
          } else if (value !== null && value !== undefined) {
            submitData.append(key, String(value));
          }
        });

        requestBody = submitData;
        // Don't set Content-Type for FormData - browser will set it with boundary
      } else {
        // If no files, send as JSON (might be what your backend expects)
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          // Convert FormData to plain object
          companyName: formData.companyName,
          country: formData.country,
          city: formData.city,
          establishedYear: formData.establishedYear,
          website: formData.website,
          fullName: formData.fullName,
          jobTitle: formData.jobTitle,
          email: formData.email,
          phone: formData.phone,
          productCategories: formData.productCategories,
          productDescription: formData.productDescription,
          monthlyCapacity: formData.monthlyCapacity,
          minimumOrderQuantity: formData.minimumOrderQuantity,
          currentlyExports: formData.currentlyExports,
          exportMarkets: formData.exportMarkets,
          portOfLoading: formData.portOfLoading,
          certifications: formData.certifications,
          internationalExperience: formData.internationalExperience,
          additionalNotes: formData.additionalNotes,
          accuracyConfirmed: formData.accuracyConfirmed,
          termsAgreed: formData.termsAgreed,
        });
      }

      console.log(
        "Submitting to:",
        "http://127.0.0.1:8000/api/suppliers/register/"
      );
      console.log("Headers:", headers);

      const response = await fetch(
        "http://127.0.0.1:8000/api/suppliers/register/",
        {
          method: "POST",
          headers,
          body: requestBody,
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Success response:", responseData);
        alert(
          "Supplier registration submitted successfully! We'll review your application and get back to you soon."
        );
        window.location.href = "/suppliers/dashboard";
      } else {
        // Get error details
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage = "Registration failed. Please try again.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message ||
            errorData.detail ||
            Object.values(errorData).join(", ");
        } catch {
          errorMessage = `Registration failed with status ${response.status}: ${errorText}`;
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Company Info", icon: Building },
    { number: 2, title: "Contact Details", icon: User },
    { number: 3, title: "Products & Business", icon: Package },
    { number: 4, title: "Certifications", icon: FileText },
    { number: 5, title: "Review & Submit", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supplier Registration
          </h1>
          <p className="text-gray-600">
            Complete your supplier profile to start receiving quote requests
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step.number ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Company Information
                </h2>
                <p className="text-gray-600">Tell us about your company</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) =>
                      updateFormData("companyName", e.target.value)
                    }
                    placeholder="Enter your company name"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="Enter your city"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Established Year *
                  </label>
                  <Input
                    value={formData.establishedYear}
                    onChange={(e) =>
                      updateFormData("establishedYear", e.target.value)
                    }
                    placeholder="e.g., 2010"
                    className={errors.establishedYear ? "border-red-500" : ""}
                  />
                  {errors.establishedYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.establishedYear}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website or Social Media Link (Optional)
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Primary Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Primary Contact Details
                </h2>
                <p className="text-gray-600">
                  Main point of contact information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Enter full name"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title / Position *
                  </label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => updateFormData("jobTitle", e.target.value)}
                    placeholder="e.g., Export Manager, CEO"
                    className={errors.jobTitle ? "border-red-500" : ""}
                  />
                  {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="contact@company.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Product & Business Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product & Business Details
                </h2>
                <p className="text-gray-600">
                  Information about your products and business
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Product Categories * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {productCategoryOptions.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.productCategories.includes(category)}
                        onChange={() =>
                          toggleArrayValue("productCategories", category)
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
                {errors.productCategories && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productCategories}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <Textarea
                  value={formData.productDescription}
                  onChange={(e) =>
                    updateFormData("productDescription", e.target.value)
                  }
                  placeholder="Describe your products, specialties, and unique selling points..."
                  rows={4}
                  className={errors.productDescription ? "border-red-500" : ""}
                />
                {errors.productDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productDescription}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Production Capacity *
                  </label>
                  <Input
                    value={formData.monthlyCapacity}
                    onChange={(e) =>
                      updateFormData("monthlyCapacity", e.target.value)
                    }
                    placeholder="e.g., 10,000 pieces/month"
                    className={errors.monthlyCapacity ? "border-red-500" : ""}
                  />
                  {errors.monthlyCapacity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.monthlyCapacity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity (MOQ) *
                  </label>
                  <Input
                    value={formData.minimumOrderQuantity}
                    onChange={(e) =>
                      updateFormData("minimumOrderQuantity", e.target.value)
                    }
                    placeholder="e.g., 500 pieces"
                    className={
                      errors.minimumOrderQuantity ? "border-red-500" : ""
                    }
                  />
                  {errors.minimumOrderQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.minimumOrderQuantity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you currently export products? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="currentlyExports"
                      value="yes"
                      checked={formData.currentlyExports === "yes"}
                      onChange={(e) =>
                        updateFormData("currentlyExports", e.target.value)
                      }
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="currentlyExports"
                      value="no"
                      checked={formData.currentlyExports === "no"}
                      onChange={(e) =>
                        updateFormData("currentlyExports", e.target.value)
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.currentlyExports && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentlyExports}
                  </p>
                )}
              </div>

              {formData.currentlyExports === "yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Export Markets
                    </label>
                    <Input
                      value={formData.exportMarkets}
                      onChange={(e) =>
                        updateFormData("exportMarkets", e.target.value)
                      }
                      placeholder="e.g., USA, Europe, Middle East"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port of Loading
                    </label>
                    <Input
                      value={formData.portOfLoading}
                      onChange={(e) =>
                        updateFormData("portOfLoading", e.target.value)
                      }
                      placeholder="e.g., Shanghai Port, Karachi Port"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Certifications & Documentation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Certifications & Documentation
                </h2>
                <p className="text-gray-600">
                  Upload your certifications and company documents
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Certifications Held (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certificationOptions.map((cert) => (
                    <label
                      key={cert}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() =>
                          toggleArrayValue("certifications", cert)
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Registration Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload PDF, JPG, or PNG
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload("companyDocument", e.target.files[0])
                      }
                      className="hidden"
                      id="companyDoc"
                    />
                    <label htmlFor="companyDoc" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    {formData.companyDocument && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {formData.companyDocument.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Catalog / Brochure
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload PDF or images
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload("productCatalog", e.target.files[0])
                      }
                      className="hidden"
                      id="catalogDoc"
                    />
                    <label htmlFor="catalogDoc" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    {formData.productCatalog && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {formData.productCatalog.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Product Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload multiple images
                    </p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={(e) =>
                        e.target.files &&
                        handleMultipleFileUpload(e.target.files)
                      }
                      className="hidden"
                      id="samplePhotos"
                    />
                    <label htmlFor="samplePhotos" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </label>
                    {formData.samplePhotos.length > 0 && (
                      <div className="mt-2">
                        {formData.samplePhotos.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs bg-gray-50 p-1 rounded mt-1"
                          >
                            <span className="truncate">{file.name}</span>
                            <button
                              onClick={() => removeFile("samplePhotos", index)}
                              className="text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Review & Submit
                </h2>
                <p className="text-gray-600">
                  Please review your information and submit your application
                </p>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Have you worked with international buyers before?
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="internationalExperience"
                      value="yes"
                      checked={formData.internationalExperience === "yes"}
                      onChange={(e) =>
                        updateFormData(
                          "internationalExperience",
                          e.target.value
                        )
                      }
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="internationalExperience"
                      value="no"
                      checked={formData.internationalExperience === "no"}
                      onChange={(e) =>
                        updateFormData(
                          "internationalExperience",
                          e.target.value
                        )
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes or Message
                </label>
                <Textarea
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    updateFormData("additionalNotes", e.target.value)
                  }
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                />
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Application Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Company:</strong> {formData.companyName}
                    </p>
                    <p>
                      <strong>Location:</strong> {formData.city},{" "}
                      {formData.country}
                    </p>
                    <p>
                      <strong>Contact:</strong> {formData.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Products:</strong>{" "}
                      {formData.productCategories.join(", ")}
                    </p>
                    <p>
                      <strong>MOQ:</strong> {formData.minimumOrderQuantity}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {formData.monthlyCapacity}
                    </p>
                    <p>
                      <strong>Exports:</strong>{" "}
                      {formData.currentlyExports === "yes" ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Consent & Agreement
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accuracyConfirmed}
                      onChange={(e) =>
                        updateFormData("accuracyConfirmed", e.target.checked)
                      }
                      className="mt-1 rounded border-gray-300"
                    />
                    <span className="text-sm">
                      I confirm that all the information provided is accurate
                      and truthful to the best of my knowledge.
                    </span>
                  </label>
                  {errors.accuracyConfirmed && (
                    <p className="text-red-500 text-sm ml-6">
                      {errors.accuracyConfirmed}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAgreed}
                      onChange={(e) =>
                        updateFormData("termsAgreed", e.target.checked)
                      }
                      className="mt-1 rounded border-gray-300"
                    />
                    <span className="text-sm">
                      I agree to 1World Sourcing's{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        supplier code of conduct
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        terms of service
                      </a>
                      .
                    </span>
                  </label>
                  {errors.termsAgreed && (
                    <p className="text-red-500 text-sm ml-6">
                      {errors.termsAgreed}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center bg-black text-white hover:bg-black/90"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white hover:bg-green-700 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Check className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need help? Contact us at{" "}
            <a
              href="mailto:suppliers@1worldsourcing.com"
              className="text-blue-600 hover:underline"
            >
              suppliers@1worldsourcing.com
            </a>{" "}
            or call +1 (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
