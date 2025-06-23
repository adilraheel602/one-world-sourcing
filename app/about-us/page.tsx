"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Globe,
  Shield,
  Users,
  Award,
  Target,
  CheckCircle,
  ArrowRight,
  Building,
  TrendingUp,
  Handshake,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header - Same as homepage */}
      <header className="sticky top-0 z-50 bg-[#f8f8f8]/90 backdrop-blur-sm border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">1WS.</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/#services"
                className="text-sm font-medium hover:text-gray-600"
              >
                Services
              </Link>
              <Link
                href="/#industries"
                className="text-sm font-medium hover:text-gray-600"
              >
                Industries
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-black border-b-2 border-black"
              >
                About
              </Link>
              <Link
                href="/#request"
                className="text-sm font-medium hover:text-gray-600"
              >
                Request Quote
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 bg-white/80"
                placeholder="Search products or industries"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="rounded-full border-black hover:bg-gray-100"
              >
                Login / Sign Up
              </Button>
            </Link>
            <Link href="/suppliers/signup">
              <Button
                variant="outline"
                className="rounded-full border-black hover:bg-gray-100"
              >
                Supplier Login
              </Button>
            </Link>
            <Button className="rounded-full bg-black text-white hover:bg-black/90">
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge className="bg-black text-white rounded-sm px-2 py-1">
              ABOUT 1WORLD SOURCING
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
              TRUSTED SINCE
              <br />
              <span className="text-6xl md:text-8xl lg:text-9xl">1992</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Over 30 years of hands-on experience in global sourcing, 
              specializing in textiles, steel, and many other industries.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">30+</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">1000+</p>
              <p className="text-sm text-gray-600">Vetted Suppliers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">50+</p>
              <p className="text-sm text-gray-600">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">99%</p>
              <p className="text-sm text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-black text-white rounded-sm px-2 py-1">
                OUR STORY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Three Decades of
                <br />
                Sourcing Excellence
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Since 1992, 1World Sourcing has been a trusted leader in global sourcing, 
                  specializing in the textile, steel, and many other industries. With over 30 years 
                  of hands-on experience, we understand the complexities of international procurement 
                  and supply chain management better than anyone.
                </p>
                <p>
                  Our extensive network of carefully vetted and reliable suppliers worldwide ensures 
                  that every product meets the highest quality and compliance standards. We don't just 
                  connect you with suppliers — we partner with you throughout the entire sourcing journey.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <Building className="h-8 w-8 mx-auto mb-3 text-black" />
                  <div className="text-2xl font-bold text-black mb-1">1992</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-black" />
                  <div className="text-2xl font-bold text-black mb-1">Growth</div>
                  <div className="text-sm text-gray-600">Continuous</div>
                </div>
                <div className="text-center p-4">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-black" />
                  <div className="text-2xl font-bold text-black mb-1">Global</div>
                  <div className="text-sm text-gray-600">Network</div>
                </div>
                <div className="text-center p-4">
                  <Handshake className="h-8 w-8 mx-auto mb-3 text-black" />
                  <div className="text-2xl font-bold text-black mb-1">Trust</div>
                  <div className="text-sm text-gray-600">& Integrity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-black text-white rounded-sm px-2 py-1 mb-4">
              OUR APPROACH
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              More Than Just Sourcing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide transparent communication, expert negotiation, and rigorous quality 
              assurance at every step. Our commitment is to your peace of mind and business success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#f8f8f8] p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                Rigorous quality control and compliance standards ensure every product 
                meets your exact specifications.
              </p>
            </div>
            
            <div className="bg-[#f8f8f8] p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Partnership Focus</h3>
              <p className="text-gray-600">
                We prioritize long-term relationships built on trust, integrity, 
                and consistent delivery.
              </p>
            </div>
            
            <div className="bg-[#f8f8f8] p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Global Network</h3>
              <p className="text-gray-600">
                Extensive network of carefully vetted and reliable suppliers 
                worldwide across multiple industries.
              </p>
            </div>
            
            <div className="bg-[#f8f8f8] p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Personalized Support</h3>
              <p className="text-gray-600">
                Expert negotiation and personalized support backed by 
                unparalleled industry knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-black text-white rounded-sm px-2 py-1">
                WHAT SETS US APART
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Your Dependable
                <br />
                Growth Partner
              </h2>
              <p className="text-lg text-gray-600">
                Whether you are a small business or a large enterprise, you can rely on 
                1World Sourcing to source competitively priced, superior products tailored 
                exactly to your specifications.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Complete Journey Partnership</h4>
                    <p className="text-gray-600">We partner with you throughout the entire sourcing journey, from initial consultation to final delivery.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Transparent Communication</h4>
                    <p className="text-gray-600">Clear, honest communication at every step ensures you're always informed and confident.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Industry Expertise</h4>
                    <p className="text-gray-600">30+ years of experience in textiles, steel, and numerous other industries worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Why Choose 1World Sourcing?</h3>
                <p className="text-gray-600">
                  With 1World Sourcing, you're not just sourcing a product, you're gaining 
                  a dependable partner dedicated to your growth and success.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-black" />
                  <span className="font-medium">Competitive Pricing</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-black" />
                  <span className="font-medium">Superior Quality Products</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-black" />
                  <span className="font-medium">Exact Specifications</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-black" />
                  <span className="font-medium">Reliable Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 md:py-24 lg:py-32 bg-white border-b border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-black text-white rounded-sm px-2 py-1 mb-4">
              INDUSTRIES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Specialized Expertise Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From our flagship expertise in textiles and steel to numerous other industries, 
              we understand the unique requirements of each sector.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f8f8f8] p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Textiles & Apparel</h3>
              <p className="text-gray-600 mb-4">
                Our flagship expertise with over 30 years of experience in fabric sourcing, 
                garment manufacturing, and fashion accessories.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Premium Fabrics & Materials</li>
                <li>• Ready-to-Wear Garments</li>
                <li>• Fashion Accessories</li>
                <li>• Technical Textiles</li>
              </ul>
            </div>
            
            <div className="bg-[#f8f8f8] p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Steel & Metals</h3>
              <p className="text-gray-600 mb-4">
                Specialized knowledge in steel procurement, metal fabrication, 
                and industrial materials sourcing.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Construction Steel</li>
                <li>• Industrial Metals</li>
                <li>• Custom Fabrication</li>
                <li>• Specialty Alloys</li>
              </ul>
            </div>
            
            <div className="bg-[#f8f8f8] p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Manufacturing</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive sourcing solutions for industrial equipment, 
                components, and manufactured goods.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Industrial Equipment</li>
                <li>• Components & Parts</li>
                <li>• Consumer Electronics</li>
                <li>• Automotive Parts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-black text-white">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the difference that 30+ years of sourcing expertise can make for your business. 
            Let's discuss how we can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#request">
              <Button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Get a Quote
              </Button>
            </Link>
            <Link href="/#services">
              <Button 
                variant="outline" 
                className="border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation - Same as homepage */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-6 py-3 bg-black text-white rounded-full">
          <Link href="/#services" className="text-sm font-medium">
            Services
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Link href="/#industries" className="text-sm font-medium">
            Industries
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Link href="/#request" className="text-sm font-medium">
            Contact
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:bg-white/10 px-4"
            >
              Login
            </Button>
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Link href="/suppliers/signup">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:bg-white/10 px-4"
            >
              Supplier Login
            </Button>
          </Link>
          <div className="w-px h-4 bg-gray-600"></div>
          <Button
            variant="ghost"
            className="text-sm font-medium hover:bg-white/10 px-4"
          >
            Request Quote
          </Button>
        </div>
      </div>

      {/* Footer - Same as homepage */}
      <footer className="py-12 md:py-20 border-t border-gray-200">
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">1WS.</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your global sourcing partner with expertise in textiles,
                apparel, and multiple industries worldwide.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Global Sourcing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Textile & Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Custom Quotes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Quality Assurance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">Industries</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Textiles & Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Furniture
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Automotive
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} 1WorldSourcing. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-600 hover:text-black">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-black">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-black">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}