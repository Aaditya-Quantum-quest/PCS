'use client';

import React from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and About Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">Prem Color Studio</h2>
              <p className="text-sm text-gray-500">Preserving Memories Since 1995</p>
            </div>
            
            <div>
              <h3 className="text-orange-500 text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm leading-relaxed">
                Moradabad's trusted partner in capturing and preserving life's most precious moments for nearly three decades. From professional photo printing to wedding photography, we deliver excellence in every frame.
              </p>
            </div>

            <div>
              <h3 className="text-orange-500 text-lg font-semibold mb-4">Business Hours</h3>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p>Monday - Sunday</p>
                  <p className="text-gray-500">9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-orange-500 text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a href="https://maps.google.com/?q=Prem+Color+Lab+Budh+Bazar+Moradabad" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm hover:text-orange-500 transition-colors group">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="group-hover:translate-x-1 transition-transform">
                  Prem Color Studio<br />
                  Budh Bazar, Opposite Kunwar Cinema<br />
                  Near Union Bank Street<br />
                  Moradabad, Uttar Pradesh 244001
                </span>
              </a>
              
              <a href="tel:+919837026365" className="flex items-center gap-3 text-sm hover:text-orange-500 transition-colors group">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">+91 98370 26365</span>
              </a>
              
              <a href="tel:+911234567890" className="flex items-center gap-3 text-sm hover:text-orange-500 transition-colors group">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">+91 1234 567890</span>
              </a>
              
              <a href="mailto:info@premcolorlab.com" className="flex items-center gap-3 text-sm hover:text-orange-500 transition-colors group">
                <Mail className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">info@premcolorlab.com</span>
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-orange-500 text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                'Acrylic Photo Printing',
                'Wedding Photography',
                'Digital Photo Studio',
                'Photo Restoration',
                'Custom Photo Albums',
                'Acrylic Photo Frames',
                'Passport Photos',
                'Digital Services'
              ].map((item) => (
                <li key={item}>
                  <Link href="/contactus" className="text-sm hover:text-orange-500 hover:translate-x-2 inline-block transition-all duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-orange-500 text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/aboutus' },
                  { name: 'Gallery', href: '/photo-gallery' },
                  { name: 'Contact Us', href: '/contactus' },
                  { name: 'Terms & Conditions', href: '/terms' },
                  { name: 'Privacy Policy', href: '/privacy' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm hover:text-orange-500 hover:translate-x-2 inline-block transition-all duration-200">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div>
              <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
              <form className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="w-full bg-white text-black pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' }
            ].map((social, index) => (
              <Link
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50"
              >
                <social.icon className="w-5 h-5 text-black" />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Prem Color Studio. All Rights Reserved. | Developed and Design by <a href='https://www.zentrixinfotech.com/' target='_blank' className='hover:trasnlate-y-19 transition-all duration-150'><span className='text-white '>Zentrix Infotech</span></a>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 group z-50"
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6 text-black group-hover:-translate-y-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
