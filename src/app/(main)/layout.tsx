
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClientInit from '../(pannel)/components/ClientInit';



export default async function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <div>
          <ClientInit/>
          <Header/>
          {children}
          <Footer/>
    </div>
  );
}
