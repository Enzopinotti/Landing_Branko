"use client";

import { useState } from "react";
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Results from './components/Results'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <SmoothScroll>
        <div className={`app ${loading ? 'overflow-hidden h-screen' : ''}`}>
          <Navbar hideInitial={loading} />
          <main>
            <Hero />
            <Services />
            <About />
            <Results />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  )
}

export default App
