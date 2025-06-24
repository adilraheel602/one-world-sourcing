"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Building,
  Globe,
  MapPin,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://web-production-3f682.up.railway.app";
const getToken = () => localStorage.getItem("accessToken");

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    industry: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // frontend/app/dashboard/settings/page.tsx
  // frontend/app/dashboard/settings/page.tsx
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        console.warn("No access token found");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/profile/`, {
          // Changed from /auth/users/me/ to /profile/
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Profile fetch failed:", res.status, text);
          return;
        }

        const data = await res.json();
        console.log("Fetched user data:", data); // Debug the response
        setUser(data);
        setProfileImage(data.profile_image || "/placeholder.svg");
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          company: data.company || "",
          phone: data.phone || "",
          industry: data.industry || "",
        });
      } catch (err) {
        console.error("🚨 Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setProfileImage(imageUrl);
    }
  };

  // frontend/app/dashboard/settings/page.tsx
  // frontend/app/dashboard/settings/page.tsx
  // frontend/app/dashboard/settings/page.tsx
  const handleSave = async () => {
    const token = getToken();
    const form = new FormData();

    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("company", formData.company);
    form.append("phone", formData.phone);
    form.append("industry", formData.industry);

    if (file) {
      form.append("profile_image", file);
    }

    const res = await fetch(`${API_BASE}/profile/`, {
      // Changed from /auth/users/me/ to /profile/
      method: "PUT",
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: form,
    });

    const result = await res.json();
    console.log("Save response:", result); // Debug the response

    if (res.ok) {
      alert("✅ Profile updated!");
      setUser((prev: any) => ({
        ...prev,
        ...(result.data || result),
      }));
      setProfileImage(
        result.data.profile_image || result.profile_image || "/placeholder.svg"
      );
      window.dispatchEvent(new Event("userProfileUpdated"));
      setIsEditing(false);
    } else {
      alert("❌ Update failed: " + JSON.stringify(result));
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      company: user.company || "",
      phone: user.phone || "",
      industry: user.industry || "",
    });
    setFile(null);
    setProfileImage(user.profile_image || "/placeholder.svg");
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch(`${API_BASE}/auth/users/set_password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${getToken()}`,
      },
      body: JSON.stringify({
        current_password: passwords.current,
        new_password: passwords.new,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Password changed!");
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      alert("❌ " + result.detail);
    }
    // No need to update profile image here after password change
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex justify-between w-full bg-white border border-gray-200 rounded-lg p-1 mb-6">
          <TabsTrigger value="profile" className="flex-1 text-center">
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 text-center">
            Team Members
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 text-center">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 text-center">
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 text-center">
            Billing
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div
                  className="relative w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden shadow-md cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image
                    priority
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="absolute bottom-1 right-1 bg-black text-white p-1 rounded-full">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <Badge>Account Owner</Badge>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", name: "first_name", icon: <User /> },
                    { label: "Last Name", name: "last_name", icon: <User /> },
                    {
                      label: "Email",
                      name: "email",
                      icon: <Mail />,
                      disabled: true,
                    },
                    { label: "Phone", name: "phone", icon: <Phone /> },
                    { label: "Company", name: "company", icon: <Building /> },
                    { label: "Industry", name: "industry", icon: <Globe /> },
                  ].map(({ label, name, icon, disabled }) => (
                    <div key={name} className="space-y-1">
                      <Label>{label}</Label>
                      {isEditing && !disabled ? (
                        <Input
                          name={name}
                          value={(formData as any)[name]}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 py-2 bg-gray-50 border rounded-md">
                          {icon}
                          <span className="ml-2">
                            {(formData as any)[name] || "—"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Account Preferences</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-gray-500">
                      Select your preferred language for the dashboard
                    </p>
                  </div>
                  <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Time Zone</h3>
                    <p className="text-sm text-gray-500">
                      Set your local time zone for accurate scheduling
                    </p>
                  </div>
                  <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="utc">
                      UTC (Coordinated Universal Time)
                    </option>
                    <option value="est">EST (Eastern Standard Time)</option>
                    <option value="cst">CST (Central Standard Time)</option>
                    <option value="mst">MST (Mountain Standard Time)</option>
                    <option value="pst">PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Currency</h3>
                    <p className="text-sm text-gray-500">
                      Set your preferred currency for quotes and orders
                    </p>
                  </div>
                  <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="jpy">JPY (¥)</option>
                    <option value="cny">CNY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Danger Zone</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-gray-500">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Log Out of All Devices</h3>
                    <p className="text-sm text-gray-500">
                      Sign out from all devices where you're currently logged
                      in.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out Everywhere
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TEAM MEMBERS */}
        <TabsContent value="team">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Team Members</h2>
            <p className="text-gray-500">
              This section will let you manage your team members.
            </p>
            <div className="mt-4 text-gray-400 italic">Coming soon...</div>
          </div>
        </TabsContent>
        {/* SECURITY */}
        <TabsContent value="security">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handlePasswordChange}>
                {[
                  { label: "Current Password", name: "current" },
                  { label: "New Password", name: "new" },
                  { label: "Confirm New Password", name: "confirm" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <Label>{label}</Label>
                    <Input
                      type="password"
                      value={(passwords as any)[name]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [name]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <Button type="submit">Update Password</Button>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <p className="text-gray-500">
              Manage your notification preferences and alerts here.
            </p>
            <div className="mt-4 text-gray-400 italic">Coming soon...</div>
          </div>
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Billing</h2>
            <p className="text-gray-500">
              View and manage your subscription & invoices.
            </p>
            <div className="mt-4 text-gray-400 italic">Coming soon...</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
