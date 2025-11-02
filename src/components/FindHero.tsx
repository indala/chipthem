import { useTranslations } from "next-intl";

export default function FindHero() {
  const t = useTranslations("FindHero");

  return (
    <section
      className="relative h-[400px] bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url('/hero.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      aria-label="Found a pet hero"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex-col items-center justify-start pt-16 text-center pt-40">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-green-100 max-w-3xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}
