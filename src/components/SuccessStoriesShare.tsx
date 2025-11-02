'use client';
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
const SuccessStoriesShare = () => {
  const t= useTranslations("SuccessStoriesShare");
  const Router=useRouter();

  return (
    <section className="py-16 bg-blue-500">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">{t('title')}</h2>
        <p className="text-xl text-blue-100 mb-8">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              Router.push('/contact');
              window.scrollTo(0, 0);
            }}
            className="bg-white text-pet-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-200"
          >
            {t('shareStory')}
          </button>
          <button
            onClick={() => {
              Router.push('/registerpet');
              window.scrollTo(0, 0);
            }}
            className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-600 transition-all duration-200"
          >
            {t('protectPet')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesShare;