import { useTranslations } from "next-intl";

const SuccessStoriesMore= () => {
  const t = useTranslations("SuccessStoriesMore");

  const stories = [
    {
      name: t('Samur.name'),
      breed: t('Samur.breed'),
      time: t('Samur.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/labrador.jpg",
      story: t('Samur.story'),
      author: t('Samur.author'),
    },
    {
      name: t('whiskers.name'),
      breed: t('whiskers.breed'),
      time: t('whiskers.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/persian-cat.jpg",
      story: t('whiskers.story'),
      author: t('whiskers.author'),
    },
    {
      name: t('rex.name'),
      breed: t('rex.breed'),
      time: t('rex.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/german-shepherd.jpg",
      story: t('rex.story'),
      author: t('rex.author'),
    },
    {
      name: t('mittens.name'),
      breed: t('mittens.breed'),
      time: t('mittens.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/calico-cat.jpg",
      story: t('mittens.story'),
      author: t('mittens.author'),
    },
    {
      name: t('charlie.name'),
      breed: t('charlie.breed'),
      time: t('charlie.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/beagle.jpg",
      story: t('charlie.story'),
      author: t('charlie.author'),
    },
    {
      name: t('Zatar.name'),
      breed: t('Zatar.breed'),
      time: t('Zatar.time'),
      imgSrc: "https://pet-microchip-system.mrehman.com/assets/images/Sunny.jpg",
      story: t('Zatar.story'),
      author: t('Zatar.author'),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(({ name, breed, time, imgSrc, story, author }) => (
            <div key={name} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                  <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{name}</h4>
                  <p className="text-sm text-gray-600">
                    {breed} &bull; {time}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">&quot;{story}&quot;</p>
              <p className="text-xs text-gray-500 mt-2">- {author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesMore;