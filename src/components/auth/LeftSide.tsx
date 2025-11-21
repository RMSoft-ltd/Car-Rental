import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { MovingCars } from './MovingCars'

function LeftSide({ isSignInPage }: { isSignInPage: boolean }) {
  return (
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated Roads with Moving Cars */}
        <MovingCars />

        <div className="relative z-10">

          {/* Main Content */}
          <div className="max-w-full">
            <div className="flex flex-col gap-3 mb-6">
             <Link href="/" className="w-fit flex items-center gap-2 text-gray-300 text-base leading-relaxed bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm">
             <ArrowLeft className="size-4 text-gray-300" />
             Back to Home
             </Link>
             
              <h1 className="text-lg font-bold text-white">
                Drive your way, rent with ease.
              </h1>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed mb-12 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              A modern car rental platform that offers customers flexible
              vehicle options with the choice of professional drivers. Whether
              for business, travel, or daily use, it ensures convenience,
              safety, and comfort in every journey.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-between  rounded-lg p-6 ">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Secure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Trusted</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA */}
        {isSignInPage ? (<div className="relative z-10 flex items-center justify-between bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <div>
            <span className="text-gray-300 block text-sm">You don&apos;t have an account?</span>
            <span className="text-white font-semibold block text-sm">Join thousands of car renters</span>
          </div>
          <Link
            href="/auth/signup"
            className="bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Sign up
          </Link>
        </div>): (
          <div className="relative z-10 flex items-center justify-between bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <div>
            <span className="text-gray-300 block text-sm">Have an account already?</span>
            <span className="text-white font-semibold block text-sm">Sign in to your account</span>
          </div>
          <Link
            href="/auth/signin"
            className="bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Sign in
          </Link>
        </div>
        )}
      </div>
  )
}

export default LeftSide