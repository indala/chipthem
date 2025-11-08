import SearchHero from "@/components/SearchHero"
import MicrochipSearch from "@/components/MicrochipSearch"
import SearchNeed from "@/components/SearchNeed"

const page = () => {
  return (
    <div>
        <SearchHero />
        <MicrochipSearch />
        <SearchNeed />
    </div>
  )
}

export default page