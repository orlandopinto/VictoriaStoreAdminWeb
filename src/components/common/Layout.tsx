import Footer from './Footer';
import Navigation from './Navigation';
import './navigation.css';

interface LayoutProps {
     children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
     return (
          <>
               <Navigation />
               <main className='bg-layer'>
                    {children}
               </main>
               <Footer />
          </>
     );
};

export default Layout;