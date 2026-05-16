import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center">
      <div className="max-w-4xl mx-auto px-4 py-32">
        <div className="text-center">
          <span className="pill mb-6">Our Story</span>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-8">
            Why We Built <span className="gradient-text">FenixRise</span>
          </h1>
          
          <div className="card p-10 text-left">
            <div className="space-y-6 font-sans text-lg text-[var(--text-secondary)]

 leading-relaxed">
              <p>
                FenixRise was born in Tashkent, Uzbekistan, from a simple observation: 
                brilliant Uzbek students were being held back not by their potential, 
                but by limited access to quality SAT and IELTS preparation resources.
              </p>
              
              <p>
                Our founder, while teaching IELTS preparation courses, witnessed countless 
                talented students struggle with outdated materials, expensive tutoring, 
                and platforms that didn't understand the unique challenges Uzbek students face.
              </p>
              
              <p>
                We built FenixRise to change that. A platform created in Uzbekistan, for 
                Uzbeks—combining adaptive learning technology with locally-relevant content. 
                No more one-size-fits-all approaches. No more prohibitive costs. Just quality 
                preparation that understands your journey.
              </p>
              
              <p className="font-display text-xl text-[var(--text-primary)] font-semibold pt-4">
                Our mission is simple: empower every Uzbek student to rise beyond boundaries 
                and compete on the global stage.
              </p>
            </div>
            
            <div className="mt-10 pt-8 border-t border-[#3A3B3C] flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary">
                Join FenixRise Today
              </Link>
              <Link to="/" className="btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;