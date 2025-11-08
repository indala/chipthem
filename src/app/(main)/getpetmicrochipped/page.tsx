'use client';
import RegisterHeros from '@/components/RegisterHeros';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';



const GetPetMicrochipped = () => {
    const router = useRouter();
    const t = useTranslations('GetPetMicrochipped');
  return (
        <div>
        <RegisterHeros />
      <main className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 my-24">
        <h1
          className="text-3xl md:text-5xl font-bold text-gray-800 mb-10 text-center"
        >
          {t('title')}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <button
            onClick={() =>router.push('/registerpet')}
            className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            {t('yesButton')}
          </button>

          <button
            onClick={() =>router.push('/contact')}
            className="w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
          >
            {t('noButton')}
          </button>
        </div>
      </main>
      </div>

    
  );
};

export default GetPetMicrochipped;
