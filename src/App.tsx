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
import Seo from './components/Seo'
import { PublicContentProvider, usePublicContent } from './cms/publicContent'

function PublicLanding() {
  const { loadState } = usePublicContent()
  const [preloaderFinished, setPreloaderFinished] = useState(false)
  const cmsReady = loadState === 'ready'

  return (
    <>
      {!preloaderFinished && <Preloader ready={cmsReady} onComplete={() => setPreloaderFinished(true)} />}
      {cmsReady && (
        <>
          <Seo />
          <SmoothScroll>
            <div className={`app ${!preloaderFinished ? 'overflow-hidden h-screen' : ''}`}>
              <Navbar hideInitial={!preloaderFinished} />
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
      )}
    </>
  )
}

function App() {
  return (
    <PublicContentProvider>
      <PublicLanding />
    </PublicContentProvider>
  )
}

export default App
