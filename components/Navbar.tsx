"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className='bg-gray-800 border-b border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and main navigation */}
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Link href='/' className='flex items-center'>
                <span className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500'>
                  OtázkoMat
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className='hidden sm:ml-6 sm:flex sm:space-x-4'>
              <Link
                href='/'
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}>
                Domov
              </Link>

              {session && (
                <Link
                  href='/my-questions'
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/my-questions"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}>
                  Moje otázky
                </Link>
              )}
            </div>
          </div>

          {/* Login button and mobile menu button */}
          <div className='flex items-center'>
            <div className='hidden sm:block'>
              <LoginButton />
            </div>

            {/* Mobile menu button */}
            <div className='sm:hidden ml-4'>
              <button
                onClick={toggleMenu}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none'
                aria-expanded={isMenuOpen}>
                <span className='sr-only'>Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          <Link
            href='/'
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/"
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}>
            Domov
          </Link>

          {session && (
            <Link
              href='/my-questions'
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/my-questions"
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}>
              Moje otázky
            </Link>
          )}

          <div className='pt-4 pb-2'>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
