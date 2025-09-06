import Logo from "@/components/Logo";
import LoginModal from "../login-modal";
import { useState } from "react";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <>
      <nav className="navbar z-10">
        <Logo />
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onLogin={() => {}}
        />
        <div className="menu-toggle" id="mobile-menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="nav-links">
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
        <div className="nav-buttons">
          <button className="btn btn-primary" id="signUpNavBtn">
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
      </nav>
    </>
  );
};
export default Navbar;
