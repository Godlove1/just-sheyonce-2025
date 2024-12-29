"use client"
import React from 'react'
import {  Twitter, Linkedin, Instagram, Facebook, Twitch, TwitterIcon, Ghost, InstagramIcon, PhoneCall } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {

    const currentYear = new Date().getFullYear();
    
  return (
    <>
      <footer className="w-full bg-black mt-12 text-white px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/bg-black.jpg"
                width={100}
                height={100}
                alt="logo"
              />
            </div>

            {/* Address Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-300 not-italic text-center text-xs md:text-left">
                123 Business Street
                <br />
                City, State 12345
                <br />
                Phone: (123) 456-7890
                <br />
                Email: info@company.com
                <br />
                Calls only: info@company.com
                <br />
                Whatsapp only: info@company.com
              </address>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 text-xs">
                <a
                  href="https://github.com"
                  className="hover:text-gray-400 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  className="hover:text-gray-400 transition-colors"
                >
                  <TwitterIcon size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="hover:text-gray-400 transition-colors"
                >
                  <Ghost size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  className="hover:text-gray-400 transition-colors"
                >
                  <InstagramIcon size={24} />
                </a>
                <a
                  href={`tel:+237676579370`}
                  className="hover:text-gray-400 transition-colors"
                >
                  <PhoneCall size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright and Developer Info */}
          <div className="mt-8 pt-8 text-xs border-t border-gray-200 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                &copy; 2022 - {currentYear} Sheyonce. All rights reserved.
              </p>
              <p className="text-gray-400 mt-2 md:mt-0 ">
                Developed & designed by{" "}
                <a
                  href="https://wa.me/237676579370"
                  className="text-white hover:text-gray-400 transition-colors underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Akale Godlove
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
