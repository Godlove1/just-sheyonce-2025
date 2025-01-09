"use client";
import React, { useEffect, useState } from "react";
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Twitch,
  TwitterIcon,
  Ghost,
  InstagramIcon,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const infoRef = doc(db, "adminUser", "vQz0BzZXRIOjQYJILn9D");
        const infoPromise = getDoc(infoRef); // Fetch the info document

        // Wait for both promises to resolve
        const [infoSnap] = await Promise.all([infoPromise]);

        if (infoSnap.exists()) {
          setInfo(infoSnap.data()); // Set the info data
          //  console.log(infoSnap.data(), "info");
        } else {
          toast.error("info not found");
          return; // Exit if info is not found
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load info");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return (
    <>
      <div
        id="install-button"
        onClick={() => pwaless.showWidget("install-prompt")}
        className="w-full bg-gray-100 p-4"
      >
        <div className="app_installer w-full flex justify-between items-center">
          {/* <!-- left --> */}
          <div className="left flex justify-center items-center ">
            <div className="logo_app mr-3">
              <Image width={45} height={45} src="/bg-black.jpg" alt="logo" />
            </div>
            <div className="text_install">
              <div className="app_name boldText text-sm">Sheyonce &trade; </div>
              <p className="text-xs">Install our app</p>
            </div>
          </div>
          {/* <!-- get_app button --> */}
          <div className="get_app">
            <Button size="sm" className="bg-black rounded-sm p-2 text-white">
              {" "}
              Install App
            </Button>
          </div>
        </div>
      </div>
      {/* <!-- Custom install button --> */}
      <footer className="w-full bg-black  text-white px-4 py-8">
        <div className="container mx-auto">
          <div className="flex justify-center items-center flex-col">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start">
              <Image src="/bg-black.jpg" width={100} height={100} alt="logo" />
            </div>

            {/* Address Section */}
            <div className="flex flex-col items-center justify-center  ">
              <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-300 not-italic text-center text-xs ">
                {info?.address}
                <br />
                {/* City, State 12345
                <br /> */}
                Email: {info?.email}
                <br />
                Calls only: {info?.phone}
                <br />
                Whatsapp only:{info?.whatsapp}
              </address>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col items-center justify-center mt-8">
              <h3 className="text-sm font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 text-xs">
                <a
                  href={info?.facebook}
                  className="hover:text-gray-400 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href={info?.twitter}
                  className="hover:text-gray-400 transition-colors"
                >
                  <TwitterIcon size={24} />
                </a>
                <a
                  href={info?.snapchat}
                  className="hover:text-gray-400 transition-colors"
                >
                  <Ghost size={24} />
                </a>
                <a
                  href={info?.instagram}
                  className="hover:text-gray-400 transition-colors"
                >
                  <InstagramIcon size={24} />
                </a>
                <a
                  href={`tel:${info?.phone}`}
                  className="hover:text-gray-400 transition-colors"
                >
                  <PhoneCall size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright and Developer Info */}
          <div className="mt-8 pt-8 text-xs border-t border-gray-200 text-center md:text-left">
            <div className="flex flex-col  justify-between items-center">
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
