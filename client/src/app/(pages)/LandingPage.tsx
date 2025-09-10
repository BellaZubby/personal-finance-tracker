import React from 'react'
import Hero from '../scenes/Hero'
import About from '../scenes/About'
import Features from '../scenes/Features'
import HowItWorks from '../scenes/HowItWorks'
import FAQ from '../scenes/FAQ'
import Navbar from '../components/navbar'

type Props = {}

const LandingPage = (props: Props) => {
  return (
    <div>
        <Hero/>
        <About/>
        <Features/>
        <HowItWorks/>
        <FAQ/>
    </div>
  )
}

export default LandingPage