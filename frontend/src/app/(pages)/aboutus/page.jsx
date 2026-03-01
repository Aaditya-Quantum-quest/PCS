'use client'

import React from 'react';
import { Camera, Award, Users, Heart, Clock, Shield, Sparkles, Target } from 'lucide-react';
import Sidebar from '@/components/section/Sidebar';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <Sidebar />
      <div className="relative h-[400px] bg-linear-to-r from-blue-900/90 to-blue-800/90 overflzow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80')"
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
            About Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
            Preserving your precious memories since 1998 with passion and excellence
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
        
        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Established in 1995, Prem Color Studio has been Moradabad's trusted partner in capturing and preserving life's most precious moments for nearly three decades. What began as a small photo printing studio has evolved into a comprehensive photography and printing service center, serving thousands of satisfied customers across the region.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Located in the heart of Budh Bazar, Moradabad, we've witnessed the evolution of photography from traditional film to digital imaging, continuously adapting and upgrading our technology to deliver the highest quality results to our clients.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">30+</div>
              <div className="text-gray-600 font-semibold">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600 font-semibold">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">50k+</div>
              <div className="text-gray-600 font-semibold">Photos Printed</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">3.9★</div>
              <div className="text-gray-600 font-semibold">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide exceptional photo printing and photography services that transform moments into timeless memories. We are committed to delivering superior quality, personalized service, and innovative solutions that exceed our customers' expectations while maintaining affordable pricing for all.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To be the leading photo lab and photography studio in Uttar Pradesh, recognized for excellence in quality, innovation, and customer satisfaction. We envision a future where every precious memory is preserved beautifully and every client experience reflects our dedication to the art of photography.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 p-8 lg:p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. From premium photo paper to state-of-the-art printing technology, every detail matters in delivering exceptional results.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our priority. We listen to your needs, understand your vision, and work tirelessly to bring your memories to life.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Creative Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously embrace new technologies and creative techniques to offer you the latest in photography and printing services.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                Built on decades of honest service, we maintain the highest ethical standards and protect your precious memories with utmost care.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Timely Service</h3>
              <p className="text-gray-600 leading-relaxed">
                We value your time. Our efficient processes ensure quick turnaround without compromising on quality or attention to detail.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                As a proud Moradabad business, we're committed to serving our community and building lasting relationships with every client.
              </p>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            What We Offer
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Photo Printing</h3>
              <p className="text-gray-600">High-quality prints in various sizes and finishes for all your photography needs.</p>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wedding Photography</h3>
              <p className="text-gray-600">Capture your special day with our experienced wedding photography services.</p>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Photo Studio</h3>
              <p className="text-gray-600">Modern studio setup for portraits, passport photos, and professional photography.</p>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Photo Restoration</h3>
              <p className="text-gray-600">Bring old and damaged photographs back to life with our restoration services.</p>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Photo Albums</h3>
              <p className="text-gray-600">Beautifully crafted photo albums and frames to showcase your memories.</p>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Services</h3>
              <p className="text-gray-600">Photo editing, color correction, and digital enhancement services.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-linear-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Visit us today at our Budh Bazar location or reach out to discuss your photography needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contactus" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform inline-block"
            >
              Contact Us
            </a>
            <a 
              href="tel:+911234567890" 
              className="bg-blue-800 text-white hover:bg-blue-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform inline-block"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
