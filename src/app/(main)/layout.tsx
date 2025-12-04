
import Header from '@/components/Header'
import Footer from '@/components/Footer'



export default async function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <div>
          <Header/>
          {children}
          <Footer/>
    </div>
  );
}
