import Footer from './Footer'
import Navigation from './Navigation'
import './navigation.css'

const Layout = (Component: any) => ({ ...props }) => {
     return (
          <>
               <Navigation />
               <main className='bg-layer'>
                    <Component {...props} />
               </main>
               <Footer />
          </>
     )
}

export default Layout