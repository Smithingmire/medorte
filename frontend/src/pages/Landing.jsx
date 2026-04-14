import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Heart, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
           
            <span className="text-xl font-bold text-[#3A86FF]">Medorte</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[#6B7280] hover:text-[#1F2933] font-medium text-sm transition-colors">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2933] mb-6 text-balance">
              Healthcare Made <br/>
              <span className="text-[#3A86FF]"> Simple</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#6B7280] mx-auto mb-10 leading-relaxed">
              Manage appointments, connect with verified doctors, and securely store medical records-all in one place with Medorte.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Sign up as Patient <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Doctor Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#1F2933] mb-3">Why Choose Medorte?</h2>
              <p className="text-[#6B7280] max-w-xl mx-auto">Built with modern technology to deliver the best healthcare experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center border border-[#E5E7EB] hover:shadow-card transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-[#3A86FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2933] mb-2">Verified Professionals</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">All doctors are thoroughly vetted and verified by our admin team before they can accept appointments.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-[#E5E7EB] hover:shadow-card transition-shadow duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-[#2EC4B6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2933] mb-2">Real-time Booking</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Book and manage your appointments seamlessly with real-time slot availability.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-[#E5E7EB] hover:shadow-card transition-shadow duration-200">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2933] mb-2">Live Doctor Chat</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Connect with your assigned doctors instantly through our secure real-time messaging platform.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#E5E7EB] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-bold text-[#3A86FF]">Medorte</span>
          </div>
          <p className="text-[#6B7280] text-sm">&copy; {new Date().getFullYear()} Medorte. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
