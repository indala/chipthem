import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {cookies} from 'next/headers';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';
import Header from '@/components/Header'
import Footer from '@/components/Footer'


export default async function RootLayout({children}: {children: React.ReactNode}) {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';
  const messages = await getMessages({locale});

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header/>
          {children}
          <Footer/>
        </NextIntlClientProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
