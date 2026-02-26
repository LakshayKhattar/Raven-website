import { useEffect, useRef, useState } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Privacy from "./Privacy";
import Terms from "./Terms";
import "./App.css";

const FALLBACK_IMAGE = "/thumbnail.png";
const VIDEO_URL = "/bg_vid.mp4";

export const DOCS_URL = "https://docs.raven.market/quickstart";
export const APP_URL = "https://dev.raven.market/";
export const TWITTER_URL = "https://x.com/Raven_market_";
export const TELEGRAM_URL = "https://t.me/RavenMarkets";
export const GITHUB_URL = "https://github.com/alpendprotocol";

export function Layout({ children, ccPrice, nextSettleDate }: { children: React.ReactNode, ccPrice: string, nextSettleDate: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onCanPlay = () => setVideoLoaded(true);
    vid.addEventListener("canplaythrough", onCanPlay);
    return () => vid.removeEventListener("canplaythrough", onCanPlay);
  }, []);

  return (
    <div className={`app-container${menuOpen ? " menu-open" : ""}`}>
      <div className="bg-fallback" style={{ backgroundImage: `url(${FALLBACK_IMAGE})` }} />
      <video
        ref={videoRef}
        className={`bg-video${videoLoaded ? " visible" : ""}`}
        autoPlay
        muted
        loop
        playsInline
        poster={FALLBACK_IMAGE}
        src={VIDEO_URL}
      />
      <div className="overlay" />

      <div className="ui-layer">
        <nav>
          <div className="nav-mobile-left">
            <button className="hamburger" onClick={() => setMenuOpen(true)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </button>
          </div>

          <Link to="/" className="nav-logo">
            <img src="/Raven_logo.svg" alt="Raven Logo" className="logo-img" />
          </Link>

          <div className="nav-right">
            <ul className="nav-links">
              <li><a href={DOCS_URL} target="_blank" rel="noreferrer">DOCS</a></li>
              <li><span style={{ opacity: 0.4, cursor: 'not-allowed', color: '#ccc', fontFamily: 'Barlow Condensed', fontWeight: 600, fontSize: 'clamp(10px, 1vw, 14px)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>ABOUT US</span></li>
            </ul>
            <a href={APP_URL} target="_blank" rel="noreferrer" className="nav-cta">LAUNCH APP</a>
          </div>
        </nav>

        {children}

        <footer>
          <div className="footer-left">
            <Link to="/privacy">PRIVACY POLICY</Link>
            <Link to="/terms">TERMS OF USE</Link>
          </div>

          <div className="social-links">
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">
              <img src="/x.png" alt="X" className="social-icon-img" />
              TWITTER
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              <img src="/tg.png" alt="Telegram" className="social-icon-img" />
              TELEGRAM
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <img src="/gthb.png" alt="GitHub" className="social-icon-img" />
              GITHUB
            </a>
            <a href={DOCS_URL} target="_blank" rel="noreferrer">
              <img src="/docs.png" alt="Docs" className="social-icon-img" />
              DOCS
            </a>
          </div>

          <div className="footer-right">
            <div className="oracle-live">ORACLE LIVE</div>
            <div className="price-row">CC/USD <strong>${ccPrice}</strong></div>
            <div className="settle-row">NEXT SETTLE <strong>{nextSettleDate} · 12:00 GMT</strong></div>
          </div>
        </footer>

        {menuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-header">
              <button className="close-menu" onClick={() => setMenuOpen(false)}>×</button>
              <img src="/Raven_logo.svg" alt="Raven Logo" className="logo-img" />
              <a href={APP_URL} target="_blank" rel="noreferrer" className="nav-cta">LAUNCH APP</a>
            </div>
            <div className="mobile-menu-content">
              <span style={{ opacity: 0.4, cursor: 'not-allowed', color: 'white', fontFamily: 'IBM Plex Mono', fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ABOUT US</span>
              <a href={DOCS_URL} target="_blank" rel="noreferrer">DOCS</a>
              <a href={TWITTER_URL} target="_blank" rel="noreferrer">TWITTER</a>
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">TELEGRAM</a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">GITHUB</a>
              <hr />
              <Link to="/privacy" onClick={() => setMenuOpen(false)}>PRIVACY POLICY</Link>
              <Link to="/terms" onClick={() => setMenuOpen(false)}>TERMS OF USE</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="hero">
      <h1>
        Market Argues,
        <span className="gold">Raven Settles.</span>
      </h1>
      <p className="hero-sub">
        DECENTRALIZED DIGITAL OPTIONS TRADING ON CANTON
      </p>
      <button className="trade-btn" onClick={() => window.open(APP_URL, '_blank')}>TRADE NOW</button>
      <p className="devnet-label">
        <span>CANTON NETWORK · DEVNET V0.1</span>
      </p>
    </div>
  );
}

export default function App() {
  const [ccPrice, setCcPrice] = useState("0.1820");
  const [nextSettleDate, setNextSettleDate] = useState("");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=CC&tsyms=USD");
        const data = await response.json();
        if (data.RAW && data.RAW.CC && data.RAW.CC.USD) {
          const price = data.RAW.CC.USD.PRICE;
          setCcPrice(price.toFixed(4));
        }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 90000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateSettleDate = () => {
      const now = new Date();
      const currentHourGMT = now.getUTCHours();
      const settleDate = new Date(now);

      if (currentHourGMT >= 16) {
        settleDate.setUTCDate(settleDate.getUTCDate() + 1);
      }

      const day = settleDate.getUTCDate();
      const month = settleDate.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase();
      setNextSettleDate(`${day} ${month}`);
    };

    calculateSettleDate();
    const interval = setInterval(calculateSettleDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout ccPrice={ccPrice} nextSettleDate={nextSettleDate}><LandingPage /></Layout>} />
        <Route path="/privacy" element={<Layout ccPrice={ccPrice} nextSettleDate={nextSettleDate}><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout ccPrice={ccPrice} nextSettleDate={nextSettleDate}><Terms /></Layout>} />
      </Routes>
    </Router>
  );
}