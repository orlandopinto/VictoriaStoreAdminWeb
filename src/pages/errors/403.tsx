import { Button } from 'primereact/button';
import errorImage from '../../assets/svg/error-403.svg';
import './erros.css';
import { useNavigate } from 'react-router-dom';

const AccessForbidden = () => {
     const navigate = useNavigate();
     return (
          <div className="access-forbidden">
               <div className="access-forbidden-image -access-forbidden-intro-x">
                    <img alt="Access Forbidden!" className="w-[450px] h-48 lg:h-auto" src={errorImage} />
               </div>
               <div className="access-forbidden-content">
                    <div className="access-forbidden-intro-x font-medium text-8xl">403</div>
                    <div className="access-forbidden-intro-x font-medium text-6xl"> Access Forbidden! </div>
                    <div className="access-forbidden-intro-x mt-3 text-lg"> Halt! Thou art endeavouring to trespass upon a realm not granted unto thee.granted unto thee. </div>
                    <div className="access-forbidden-intro-x" style={{ paddingTop: '2rem' }}>
                         <Button severity="info" onClick={() => navigate('/dashboard')}> Back to Dashboard </Button>
                    </div>
               </div>
          </div>
     )
}

export default AccessForbidden