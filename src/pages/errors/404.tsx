import { Button } from 'primereact/button';
import errorImage from '../../assets/svg/error-404.svg';
import './erros.css';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
     const navigate = useNavigate();
     return (
          <div className="not-found">
               <div className="not-found-image -intro-x">
                    <img alt="Page Not fond" className="w-[450px] h-48 lg:h-auto" src={errorImage} />
               </div>
               <div className="not-found-content">
                    <div className="intro-x font-medium text-6xl"> Oops. This page has gone missing. </div>
                    <div className="intro-x mt-3 text-lg"> You may have mistyped the address or the page may have moved. </div>
                    <div className="intro-x" style={{ paddingTop: '2rem' }}>
                         <Button severity="info" onClick={() => navigate('/dashboard')}> Back to Dashboard </Button>
                    </div>
               </div>
          </div>
     )
}

export default PageNotFound