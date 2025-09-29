import Loader from "@/components/Loader";
import "./style.css";
import Navbar from "@/components/Navbar";
import Plans from "./components/plans";
import StatisticsSection from "./components/stats";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const MarketingHome = () => {
  useEffect(() => {
    const scrollToPlans = () => {
      const plansSection = document.getElementById('our-investment-plans-section');
      if (plansSection) {
        plansSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    const scrollToPlansBtn = document.getElementById('scrollToPlansBtn');
    if (scrollToPlansBtn) {
      scrollToPlansBtn.addEventListener('click', scrollToPlans);
    }

    return () => {
      if (scrollToPlansBtn) {
        scrollToPlansBtn.removeEventListener('click', scrollToPlans);
      }
    };
  }, []);
  return (
    <div className="w-full">
      <div className="animated-bg"></div>

      {/* <Loader /> */}
      <Navbar />

      <header className="hero-section">
        <div className="container flex justify-center">
          <div className="hero-content">
            <h1>
              <span className="highlight-text">
                Invest in the Future of Music
              </span>
            </h1>
            <p>
              Empower artists, discover talent, and earn passive income with{" "}
              <span className="highlight-text">SPARK</span>'s innovative
              investment platform.
            </p>
            <button className="btn btn-primary" id="scrollToPlansBtn">
              Explore Plans
            </button>
          </div>
        </div>
      </header>

      <Plans />

      <section
        className="why-choose-spark-section"
        id="why-choose-spark-section"
      >
        <div className="container">
          <h2>
            Why Choose <span className="highlight-text">SPARK</span>?
          </h2>
          <p>Investing in music has never been easier or more rewarding.</p>
          <div className="cards-grid">
            <div className="card">
              <img
                src="images/icon-diverse.png"
                alt="Diverse Opportunities Icon"
                className="card-icon"
              />
              <h3>Diverse Opportunities</h3>
              <p>
                Access a wide range of music projects, from emerging artists to
                established labels.
              </p>
            </div>
            <div className="card">
              <img
                src="images/icon-transparent.png"
                alt="Transparent Earnings Icon"
                className="card-icon"
              />
              <h3>Transparent Earnings</h3>
              <p>
                Enjoy clear, verifiable revenue shares and detailed performance
                analytics.
              </p>
            </div>
            <div className="card">
              <img
                src="images/icon-invest.png"
                alt="Vibrant Community Icon"
                className="card-icon"
              />
              <h3>Vibrant Community</h3>
              <p>
                Join a network of passionate investors and artists, all
                connected by music.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="choose-your-journey-section"></section>

      <StatisticsSection />

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Shape the Future of Music?</h2>
          <p>
            Join thousands of Investors and artists building the next generation
            of the music industry
          </p>
          <button className="btn btn-primary" id="openCtaPlansModal">
            Get Started Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketingHome;
