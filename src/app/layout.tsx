import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {cookies} from 'next/headers';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from "sonner";


export default async function RootLayout({children}: {children: React.ReactNode}) {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';
  const messages = await getMessages({locale});

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>  
        <Toaster position="top-right" richColors closeButton toastOptions={{style:{top: "64px"}}}/>
          {children}
        </NextIntlClientProvider>
        <ScrollToTop />
        
      </body>
    </html>
  );
}
