'use client';

import Link from "next/link"; // 1. Use next/link
import { useTranslations } from "next-intl"; // 2. Use next-intl hook
import {
  LuMail,
  LuPhone,
  LuBuilding2,
  LuDatabase,
  LuPlus,
  LuSearch,
  LuHeart,
} from "react-icons/lu";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";

const Footer = () => {
  // Use the useTranslations hook from next-intl
  const t = useTranslations('Footer'); // Assuming you have a 'Footer' namespace in your messages files

  // Note: removed scroll-to-top behavior and InternalLink wrapper per request.

  return (
    <footer className="bg-slate-800 text-white relative">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Chipthem Information */}
          <div>
            <h3 className="font-bold text-xl mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                {t('chipthem')}
              </span>
              <div className="text-sm text-gray-300 font-normal mt-1">{t('petRegistry')}</div>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {t('description')}
            </p>
            
            {/* Emergency Button */}
            <div className="bg-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <AiOutlineWarning className="h-5 w-5" />
                <span className="font-bold">{t('lostPetEmergency')}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <LuPhone className="h-4 w-4 text-pink-300" />
                <span className="font-bold">{t('emergencyPhone')}</span>
              </div>
              <p className="text-xs text-white/90">{t('emergencyAvailable')}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4 relative">
              {t('services.title')}
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-cyan-400"></div>
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-300">
                <LuBuilding2 className="h-4 w-4 text-blue-400" />
                <Link href="/about" className="hover:text-white transition-colors cursor-pointer">
                  {t('services.professionalMicrochipping')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <LuDatabase className="h-4 w-4 text-green-400" />
                <Link href="/about" className="hover:text-white transition-colors cursor-pointer">
                  {t('services.databaseRegistry')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <LuPlus className="h-4 w-4 text-yellow-400" />
                <Link href="/registerpet" className="hover:text-white transition-colors cursor-pointer">
                  {t('services.petRegistration')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <LuSearch className="h-4 w-4 text-purple-400" />
                <Link href="/search" className="hover:text-white transition-colors cursor-pointer">
                  {t('services.microchipSearch')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 relative">
              {t('quickLinks.title')}
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-400"></div>
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-300">
                <LuPlus className="h-4 w-4 text-blue-400" />
                <Link href="/registerpet" className="hover:text-white transition-colors cursor-pointer">
                  {t('quickLinks.registerYourPet')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <AiOutlineWarning
                 className="h-4 w-4 text-red-400" />
                <Link href="/lostfound" className="hover:text-white transition-colors cursor-pointer">
                  {t('quickLinks.reportLostPet')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <LuSearch className="h-4 w-4 text-green-400" />
                <Link href="/search" className="hover:text-white transition-colors cursor-pointer">
                  {t('quickLinks.searchFoundPet')}
                </Link>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <LuHeart className="h-4 w-4 text-pink-400" />
                <Link href="/successstories" className="hover:text-white transition-colors cursor-pointer">
                  {t('quickLinks.successStories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Support & Follow Us */}
          <div>
            <h3 className="font-bold text-white mb-4 relative">
              {t('support247')}
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-cyan-400"></div>
            </h3>

            {/* Email Contact */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <LuMail className="h-4 w-4 text-blue-400" />
                {/* 3. Standard <a> tag for external links (mailto) */}
                <a href="mailto:Info@chipthem.com" className="hover:text-white transition-colors">
                  <span>{t('supportEmail')}</span>
                </a>
              </div>
              <p className="text-xs text-gray-400 ml-6">{t('generalInquiries')}</p>
            </div>

            {/* Phone Contact */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <LuPhone className="h-4 w-4 text-green-400" />
                {/* Standard <a> tag for phone links */}
                <a href="tel:+962798980504" className="hover:text-white transition-colors">
                  <span>{t('supportPhone')}</span>
                </a>
              </div>
              <div className="text-xs text-gray-400 ml-6">
                <p>{t('hoursSatThu')}</p>
                <p>{t('hoursFri')}</p>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-bold text-white mb-3">{t('followUs')}</h4>
              <div className="flex gap-3">
                {/* Standard <a> tags for external social media links */}
                <a href="https://www.instagram.com/chipthem.jo?igsh=YnVnd2hkODJkMWVq" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <BsInstagram className="h-4 w-4 text-white" />
                </a>
                <a href="https://www.facebook.com/share/17HX8wVHuN/" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <BsFacebook className="h-4 w-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900 border-t border-slate-700">
        <div className=" mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-300">
              {t('copyright')}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <AiOutlineCheckCircle className="h-4 w-4 text-green-400" />
                <span>{t('sslSecured')}</span>
              </div>
              <div className="flex items-center gap-2">
                <AiOutlineCheckCircle className="h-4 w-4 text-blue-400" />
                <span>{t('successRate')}</span>
              </div>
              <div>
                {t('trustedBy')}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              {/* Use Link for internal navigation */}
              <Link href="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t('termsOfService')}</Link>
              <Link href="/contact" className="hover:text-white transition-colors">{t('contactUs')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-to-top button removed per request */}
    </footer>
  );
};

export default Footer;