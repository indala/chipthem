import LostFoundHero from "@/components/LostFoundHero"
import LostFoundQuickActions from "@/components/LostFoundQuickActions"
import LostFoundLostReport from "@/components/LostFoundLostreport"
import LostFoundFoundReport from "@/components/LostFoundFoundReport"
const page = () => {
  return (
    <div>
        <LostFoundHero />
        <LostFoundQuickActions />
        <LostFoundLostReport />
        <LostFoundFoundReport />
    </div>
  )
}

export default page