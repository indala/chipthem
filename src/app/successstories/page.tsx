import SuccessStoriesHero from "@/components/SuccessStoriesHero"
import SuccessStoriesRecent from "@/components/SuccessStoriesRecent"
import SuccessStoriesMore from "@/components/SuccessStoriesMore"
import SuccessStoriesNumber from "@/components/SuccessStoriesNumber"
import SuccessStoriesShare from "@/components/SuccessStoriesShare"
const page = () => {
  return (
    <div>
        <SuccessStoriesHero />
        <SuccessStoriesRecent />
        <SuccessStoriesMore />
        <SuccessStoriesNumber />
        <SuccessStoriesShare />
    </div>
  )
}

export default page