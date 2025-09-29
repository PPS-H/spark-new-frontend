import Logo from "@/components/Logo";
import LoginModal from "../login-modal";
import { useState } from "react";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const scrollToPlans = () => {
    const plansSection = document.getElementById('our-investment-plans-section');
    if (plansSection) {
      plansSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  return (
    <>
      <nav className="navbar z-10 relative">
        <Logo />
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onLogin={() => {}}
        />
        
        {/* Mobile Hamburger Menu Toggle */}
        <div 
          className={`md:hidden flex flex-col cursor-pointer ${showMobileMenu ? 'active' : ''}`} 
          id="mobile-menu"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className="w-6 h-0.5 bg-current mb-1 transition-all"></span>
          <span className="w-6 h-0.5 bg-current mb-1 transition-all"></span>
          <span className="w-6 h-0.5 bg-current transition-all"></span>
        </div>
        
        {/* Desktop Navigation Links */}
        <ul className="nav-links hidden md:flex">
          <li>
            <a href="#why-choose-spark-section" className="nav-link">
              Why Choose <span className="highlight-text">SPARK</span>
            </a>
          </li>
          <li>
            <a
              href="#our-investment-plans-section"
              className="nav-link"
              id="navBrowsePlansLink"
            >
              Investment Plans
            </a>
          </li>
          <li>
            <a href="#" className="nav-link">
              How it Works
            </a>
          </li>
          <li>
            <a href="#" className="nav-link">
              Testimonials
            </a>
          </li>
        </ul>
        
        {/* Desktop Navigation Buttons */}
        <div className="nav-buttons hidden md:flex">
          <button 
            className="btn btn-primary" 
            id="signUpNavBtn"
            onClick={scrollToPlans}
          >
            Sign Up
          </button>
          <button
            className="btn btn-secondary"
            id="signInBtn"
            onClick={() => setShowLoginModal(!showLoginModal)}
          >
            Sign In
          </button>
        </div>
        
        {/* Mobile Menu - Conditionally Rendered */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden">
            <ul className="flex flex-col p-0 m-0 list-none">
              <li className="border-b border-gray-200">
                <a 
                  href="#why-choose-spark-section" 
                  className="block px-5 py-4 text-gray-800 hover:bg-gray-50 no-underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Why Choose <span className="highlight-text">SPARK</span>
                </a>
              </li>
              <li className="border-b border-gray-200">
                <a
                  href="#our-investment-plans-section"
                  className="block px-5 py-4 text-gray-800 hover:bg-gray-50 no-underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Investment Plans
                </a>
              </li>
              <li className="border-b border-gray-200">
                <a 
                  href="#" 
                  className="block px-5 py-4 text-gray-800 hover:bg-gray-50 no-underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  How it Works
                </a>
              </li>
              <li className="border-b border-gray-200">
                <a 
                  href="#" 
                  className="block px-5 py-4 text-gray-800 hover:bg-gray-50 no-underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Testimonials
                </a>
              </li>
            </ul>
            <div className="p-5 flex flex-col gap-3">
              <button 
                className="btn btn-primary w-full py-3" 
                onClick={() => {
                  scrollToPlans();
                  setShowMobileMenu(false);
                }}
              >
                Sign Up
              </button>
              <button
                className="btn btn-secondary w-full py-3"
                onClick={() => {
                  setShowLoginModal(!showLoginModal);
                  setShowMobileMenu(false);
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
