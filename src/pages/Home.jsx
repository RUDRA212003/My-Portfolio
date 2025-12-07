import Hero from '../components/Hero'
import About from '../components/About'
import ProjectsSection from '../components/ProjectsSection'
import CardsSection from '../components/CardsSection'
import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <ProjectsSection />
      <CardsSection />
      <ContactForm />
    </div>
  )
}
