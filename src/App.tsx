import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Results from './components/Results'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'

function App() {
  return (
    <SmoothScroll>
      <div className="app">
        <Navbar />
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
  )
}

export default App
