import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home", role: "PUBLIC" },
    { href: "/destinations", label: "Destinations", role: "PUBLIC" },
    { href: "/trips", label: "Trips", role: "PUBLIC" },
    { href: "/about", label: "About", role: "PUBLIC" },
    { href: "/contact", label: "Contact", role: "PUBLIC" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <span className="text-xl font-bold">TravelBuddy</span>
            </div>
            <p className="text-gray-300 text-sm max-w-xs">Your trusted travel companion for unforgettable journeys and authentic experiences.</p>

            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {[
                { icon: FaFacebookF, label: "Facebook", link: "https://www.facebook.com/yeasinarafat.arafat.9026/" },
                { icon: FaTwitter, label: "Twitter", link: "https://x.com/Dev_Yeasin8" },
                { icon: FaLinkedinIn, label: "LinkedIn", link: "https://www.linkedin.com/in/yeasinarafat121/" },
              ].map((social) => (
                <Link
                  target="_blank"
                  key={social.label}
                  href={social.link}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>123 Travel Street, Adventure City</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <FaPhone className="text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <FaEnvelope className="text-blue-500" />
                <span>hello@travelbuddy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-300 text-sm text-center md:text-left">
              <p>© {currentYear} TravelBuddy. All rights reserved.</p>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>for travelers</span>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
