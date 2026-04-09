'use client'

import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#FCF8F1] bg-opacity-30">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" title="" className="flex">
              <img
                className="w-auto h-8"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg"
                alt=""
              />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
          >
            <svg
              className={`${open ? 'hidden' : 'block'} w-6 h-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <svg
              className={`${open ? 'block' : 'hidden'} w-6 h-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
            <a href="#" title="" className="text-base text-black transition-all duration-200 hover:text-opacity-80"> Features </a>
            <a href="#" title="" className="text-base text-black transition-all duration-200 hover:text-opacity-80"> Solutions </a>
            <a href="#" title="" className="text-base text-black transition-all duration-200 hover:text-opacity-80"> Resources </a>
            <a href="#" title="" className="text-base text-black transition-all duration-200 hover:text-opacity-80"> Pricing </a>
          </div>

          {/* Desktop CTA */}
          <a
            href="#"
            title=""
            className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
            role="button"
          >
            Join Now
          </a>

        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden py-4 space-y-3 border-t border-gray-100">
            <a href="#" className="block text-base text-black transition-all duration-200 hover:text-opacity-80">Features</a>
            <a href="#" className="block text-base text-black transition-all duration-200 hover:text-opacity-80">Solutions</a>
            <a href="#" className="block text-base text-black transition-all duration-200 hover:text-opacity-80">Resources</a>
            <a href="#" className="block text-base text-black transition-all duration-200 hover:text-opacity-80">Pricing</a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-white bg-black rounded-full hover:bg-yellow-300 hover:text-black"
              role="button"
            >
              Join Now
            </a>
          </div>
        )}

      </div>
    </header>
  )
}
