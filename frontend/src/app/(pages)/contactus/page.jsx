'use client'

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Sidebar from '@/components/section/Sidebar'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    // Let the form submit naturally to FormSubmit
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Sidebar />

      {/* Hero Section */}
      <div className="relative h-96 bg-linear-to-r from-blue-900 to-blue-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80')"
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
            Visit us at Prem Color Studio, Moradabad - Your trusted photo printing partner
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 lg:h-24">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="white"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-20 pb-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Contact Info */}
            <div className="p-8 lg:p-12 bg-linear-to-br from-gray-50 to-white">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in touch
              </h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Visit our store or reach out to us for professional photo printing services.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Prem Color Studio<br />
                      Moradabad, Uttar Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                    <a href="mailto:info@premcolorlab.com" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                      info@premcolorlab.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm">
                      Phone: +91 1234 567890<br />
                      Mobile: +91 9876 543210
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Follow us on social media</h3>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-white fill-white" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-white fill-white" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-white fill-white" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 lg:p-12 bg-white">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a message
              </h2>

              <form 
                action="https://formsubmit.co/team.zentrixinfotech@gmail.com" 
                method="POST"
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border text-black border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-semibold text-gray-700 mb-2">
                      Surname
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="Your surname"
                      className="w-full px-4 py-3 rounded-xl border text-black border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-xl text-black border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="w-full px-4 py-3 rounded-xl border text-black border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border text-black border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-2xl h-96 border-4 border-white">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55919.866200170996!2d78.73401108428736!3d28.839108976510275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afbeab0a57921%3A0x4f2c033a1115564a!2sPrem%20Color%20Studio!5e0!3m2!1sen!2sin!4v1764567919823!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;