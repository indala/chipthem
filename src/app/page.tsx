
import Hero from '@/components/Hero'
import QuickActions from '@/components/QuickActions'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import ProvenResults from '@/components/ProvenResults'

const page = () => {
  return (
    <div>
        <Hero/>
        <QuickActions/>
        <HowItWorks/>
        <Stats/>
        <ProvenResults/>
    </div>
  )
}

export default page