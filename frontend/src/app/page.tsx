import React from 'react';
import Image from 'next/image';
import truckImage from '../../public/images/vecteezy_a-truck-with-a-trailer-is-driving-on-the-motorway-at-night_27101183.jpg';
import Header from '@/components/header';

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col min-h-screen bg-gray-900 text-gray-200"
      style={{ fontFamily: "'Inter', 'Spline Sans', sans-serif" }}
    >
      {/* Header */}
      <Header />
      <main className="flex-1 pt-20 py-6">
        <section className="relative py-20 md:py-32 animate-slide-in overflow-hidden">
        
       <Image
  src={truckImage}
  alt="Truck on motorway at night"
  fill
  style={{
    objectFit: 'cover',
    opacity: 0.3,           // increase opacity for testing
    position: 'absolute',
    zIndex: 1,             
    inset: 0,
  }}
  priority
/>

          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 -z-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
              Powering Your Progress, Seamlessly.
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-gray-300">
              FuelEase provides intelligent fuel distribution solutions, ensuring efficiency and reliability for your business.
            </p>

          </div>
        </section>

        <section className="bg-gray-900 py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="flex flex-col gap-4 text-center items-center mb-16 animate-slide-in"
              style={{ animationDelay: '0.2s' }}
            >
              <h2 className="text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
                Key Features
              </h2>
              <p className="text-gray-400 text-lg font-normal leading-normal max-w-3xl">
                Discover the powerful features that make FuelEase the ultimate solution for your fuel management needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'dashboard',
                  title: 'Intuitive Dashboard',
                  description:
                    'A user-friendly interface providing a comprehensive overview of your fuel operations at a glance.',
                },
                {
                  icon: 'analytics',
                  title: 'Advanced Analytics',
                  description: 'Gain valuable insights with detailed reports and analytics to optimize your fuel efficiency.',
                },
                {
                  icon: 'notifications',
                  title: 'Automated Alerts',
                  description: 'Receive real-time notifications for low fuel levels, maintenance schedules, and unusual activity.',
                },
              ].map(({ icon, title, description }, idx) => (
                <div
                  key={title}
                  className="flex flex-col gap-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-8 text-left transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-green-500/10 transform hover:-translate-y-2 animate-slide-in"
                  style={{ animationDelay: `${0.4 + idx * 0.2}s` }}
                >
                  <div className="flex items-center justify-center size-14 rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                      {icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold leading-tight">{title}</h3>
                    <p className="text-gray-300 text-base font-normal leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-gray-900 animate-slide-in" style={{ animationDelay: '1s' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About FuelEase</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              FuelEase was founded with a mission to revolutionize the fuel distribution industry. We believe in leveraging technology
              to provide smart, reliable, and cost-effective solutions for businesses of all sizes. Our commitment to innovation and
              customer satisfaction drives us to continuously improve and expand our services.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
