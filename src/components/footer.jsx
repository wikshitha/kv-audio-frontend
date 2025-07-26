import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-12 pb-6 px-6 md:px-12 mt-20 border-t border-gray-800 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-green-400 transition duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/items" className="hover:text-green-400 transition duration-200">
                Items
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-green-400 transition duration-200">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-400 transition duration-200">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Contact Info
          </h4>
          <p className="mb-2">
            <span className="text-gray-400">Email: </span>
            <a href="mailto:contact@audiorental.com" className="hover:text-green-400 transition">
              contact@audiorental.com
            </a>
          </p>
          <p className="mb-2">
            <span className="text-gray-400">Phone: </span>
            <a href="tel:+11234567890" className="hover:text-green-400 transition">
              +1 123-456-7890
            </a>
          </p>
          <address className="not-italic text-gray-400 text-sm mt-4 leading-relaxed">
            123 Audio Street<br />
            Music City, NY 10001<br />
            United States
          </address>
        </div>

        {/* Copyright + Credit */}
        <div className="flex flex-col items-start lg:items-end justify-end">
          <div className="text-sm text-gray-500 border-t border-gray-800 pt-6 w-full lg:w-auto text-left lg:text-right">
            © 2025 AudioRental. All rights reserved.
          </div>
          <div className="text-xs text-gray-600 mt-2 italic">
            Designed & Developed by <span className="text-green-400 font-medium">Wikshitha Umindu</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


