"use client";

import React from "react";
import Header from "@/components/header";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen  bg-gray-900 text-[#E0E0E0] pt-20" style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif" }}>
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Powering Progress, Fuelling Futures
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-[#E0E0E0]">
            FuelEase is a leading fuel distribution company committed to
            providing reliable and sustainable energy solutions. Our mission
            is to power businesses and communities efficiently and responsibly.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-blue-950 border border-[#2E2E2E]">
            <span className="material-symbols-outlined text-4xl text-[#4CAF50] mb-4">
              rocket_launch
            </span>
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
            <p className="mt-2 text-[#E0E0E0]">
              To deliver exceptional fuel distribution services while prioritizing environmental sustainability and community engagement.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-blue-950 border border-[#2E2E2E]">
            <span className="material-symbols-outlined text-4xl text-[#4CAF50] mb-4">
              verified
            </span>
            <h3 className="text-xl font-bold text-white">Our Values</h3>
            <p className="mt-2 text-[#E0E0E0]">
              Integrity, Reliability, Sustainability, Innovation, and Customer Focus are at the core of everything we do.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-blue-950 border border-[#2E2E2E]">
            <span className="material-symbols-outlined text-4xl text-[#4CAF50] mb-4">
              history
            </span>
            <h3 className="text-xl font-bold text-white">Our Vision</h3>
            <p className="mt-2 text-[#E0E0E0]">
              To be the most trusted and innovative energy partner, leading the transition to a sustainable future.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 bg-blue-950 -translate-x-1/2"></div>
            <div className="relative flex flex-col gap-16">

              <div className="flex w-full items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="text-xl font-bold text-white">2005</p>
                  <p className="text-lg font-semibold text-blue-400">Founded</p>
                  <p className="mt-2 text-[#E0E0E0]">FuelEase was established with a vision to revolutionize fuel distribution.</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">flag</span>
                </div>
              </div>

              <div className="flex w-full items-center">
                <div className="w-1/2 pl-8 text-left ml-auto">
                  <p className="text-xl font-bold text-white">2012</p>
                  <p className="text-lg font-semibold text-blue-400">Expanded Operations</p>
                  <p className="mt-2 text-[#E0E0E0]">We expanded our operations to serve a wider range of clients and industries.</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-950  flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">domain</span>
                </div>
              </div>
              <div className="flex w-full items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="text-xl font-bold text-white">2020</p>
                  <p className="text-lg font-semibold text-blue-400">Sustainability Initiative</p>
                  <p className="mt-2 text-[#E0E0E0]">We committed to reducing our environmental impact and promoting sustainable practices.</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">eco</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
