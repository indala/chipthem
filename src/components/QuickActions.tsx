'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const QuickActions = () => {
  const t = useTranslations('QuickActions');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const actions = [
    {
      icon: MapPin,
      title: t('findClinic'),
      description: t('findClinicDesc'),
      buttonText: t('findNearbyClinics'),
      route: '/findclinic',
      cardBg: "bg-blue-50",
      iconBg: "bg-blue-600",
      iconColor: "text-white",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: PlusCircle,
      title: t('registerPet'),
      description: t('registerPetDesc'),
      buttonText: t('registerNow'),
      route: '/registerpet',
      cardBg: "bg-green-50",
      iconBg: "bg-green-600",
      iconColor: "text-white",
      buttonBg: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: Search,
      title: t('searchPet'),
      description: t('searchPetDesc'),
      buttonText: t('searchDatabase'),
      route: '/search',
      cardBg: "bg-orange-50",
      iconBg: "bg-orange-600",
      iconColor: "text-white",
      buttonBg: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isRTL ? 'rtl' : 'ltr'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow duration-200 border-0 shadow-md ${action.cardBg}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${action.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${action.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{action.title}</CardTitle>
                </CardHeader>

                <CardContent className="text-center pt-0">
                  <CardDescription className="mb-6 text-base text-gray-700">
                    {action.description}
                  </CardDescription>
                  <Button
                    onClick={() => {
                      router.push(action.route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-white font-medium rounded-lg ${action.buttonBg}`}
                  >
                    {action.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
