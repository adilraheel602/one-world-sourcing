"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Supplier } from "../../types";

const SupplierProfile = () => {
  const [profile, setProfile] = useState<Supplier | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/suppliers/login";
      return;
    }

    // Helper to decode JWT
    function parseJwt(token: string) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.error("Failed to parse JWT:", e);
        return null;
      }
    }

    const payload = parseJwt(token);
    if (!payload) {
      alert("Invalid token.");
      window.location.href = "/suppliers/login";
      return;
    }

    const id = payload?.user_id || payload?.id;

    if (!id) {
      alert("Could not determine supplier ID.");
      window.location.href = "/suppliers/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://web-production-3f682.up.railway.app/api/suppliers/${id}/`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );

        if (!res.data || Object.keys(res.data).length === 0) {
          throw new Error("Empty profile data.");
        }

        // Ensure contact is at least an empty object
        if (!res.data.contact) {
          res.data.contact = {
            name: "",
            position: "",
            email: "",
            phone: "",
            website: "",
            address: "",
          };
        }

        setProfile(res.data);
      } catch (error: any) {
        console.error(
          "❌ Error fetching supplier profile:",
          error.response?.data || error.message
        );
        alert("Failed to load supplier profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://web-production-3f682.up.railway.app/api/suppliers/suppliers/${profile.id}/`,
        profile,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      alert("Profile updated!");
    } catch (error: any) {
      alert(
        "Error updating profile: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "contact_name",
        "position",
        "email",
        "phone",
        "website",
        "address",
      ].includes(name)
    ) {
      setProfile({
        ...profile!,
        contact: {
          ...profile!.contact!,
          [name === "contact_name" ? "name" : name]: value,
        },
      });
    } else {
      setProfile({
        ...profile!,
        [name]: name === "established_year" ? parseInt(value) : value,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/suppliers/login";
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-8">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-2xl font-bold">
          1WS.
        </Link>
        <div>
          <Link href="/suppliers/dashboard">
            <Button variant="outline" className="mr-2">
              Dashboard
            </Button>
          </Link>
          <Button onClick={handleLogout} className="bg-black text-white">
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
        <form
          onSubmit={handleUpdate}
          className="bg-white p-4 rounded-lg border space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={profile.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={profile.category || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={profile.country}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="established_year"
            placeholder="Established Year"
            value={profile.established_year}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="employees"
            placeholder="Employees"
            value={profile.employees}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={profile.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="min_order_value"
            placeholder="Min Order Value"
            value={profile.min_order_value}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="production_capacity"
            placeholder="Production Capacity"
            value={profile.production_capacity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />

          {/* Contact Details */}
          <input
            type="text"
            name="contact_name"
            placeholder="Contact Name"
            value={profile.contact?.name || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={profile.contact?.position || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.contact?.email || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={profile.contact?.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="url"
            name="website"
            placeholder="Website"
            value={profile.contact?.website || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={profile.contact?.address || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <Button type="submit" className="w-full bg-black text-white">
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SupplierProfile;
