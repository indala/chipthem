import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PetProtectionSection() {
  const t = useTranslations("AboutReady");

  return (
    <section className="py-20 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          {t("title")}
        </h2>

        <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/registerpet"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-xl">🏠</span>
            <span>{t("registerPet")}</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-200"
          >
            <span className="text-xl">📞</span>
            <span>{t("scheduleVisit")}</span>
          </Link>
        </div>

        <p className="flex items-center justify-center text-blue-100 mt-6 text-sm gap-2">
          <span>💡</span>
          <span>{t("questions")}</span>
        </p>
      </div>
    </section>
  );
}
