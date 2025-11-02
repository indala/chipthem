'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, Scan, Database, Heart, CheckCircle2, Phone, Mail, IdCard } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations('HowItWorks');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const steps = [
    {
      number: 1,
      icon: Fingerprint,
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      number: 2,
      icon: Scan,
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      number: 3,
      icon: Database,
      title: t("step3.title"),
      description: t("step3.description"),
    },
    {
      number: 4,
      icon: Heart,
      title: t("step4.title"),
      description: t("step4.description"),
    },
  ];

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="relative py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Decorative blurred accents */}
      <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 w-72 h-72 rounded-full bg-gradient-to-tr from-blue-300/40 via-indigo-300/30 to-transparent blur-3xl transform rotate-45" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-300/30 via-teal-200/20 to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -top-24 right-1/2 translate-x-1/2 w-56 h-56 rounded-full bg-pink-200/20 blur-2xl" />

      <div className="container mx-auto px-4">
        <div className={`text-center mb-14 ${isRTL ? 'rtl' : 'ltr'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h2>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          {/* Left: Numbered steps list */}
          <div className="space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              const numberColors: Record<number, string> = {
                1: "bg-sky-400",
                2: "bg-green-500",
                3: "bg-orange-500",
                4: "bg-purple-500",
              };
              return (
                <div key={step.number} className="flex gap-5">
                  <div
                    className={`flex-none w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold ${numberColors[step.number]}`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Scanner results card */}
          <Card className="shadow-lg bg-white rounded-xl">
            <CardHeader className="pb-2">
              <div className="mx-auto mb-4 mt-2 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-green-500 flex items-center justify-center">
                <IdCard className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                {t("scannerResults.title")}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 text-green-800 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
                <div>
                  <div className="font-bold text-green-800">{t("chipDetected")}</div>
                  <div className="text-sm text-gray-600">ID: 123456789012345</div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-sm font-bold mb-3 text-gray-800">{t("ownerContactInfo")}</div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-800">Firas Rabie</div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span>(079) 222-3333</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <span>firas@email.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-4 py-2 text-sm font-medium">
                  <Heart className="h-4 w-4" />
                  {t("reunionInProgress")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
