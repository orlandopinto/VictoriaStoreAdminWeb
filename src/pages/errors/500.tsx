import { Button } from 'primereact/button';
import errorImage from '../../assets/svg/error-500.svg';
import './erros.css';
import { useNavigate } from 'react-router-dom';

const InternalServerError = () => {
     const navigate = useNavigate();
     return (
          <div className="internal-server-error">
               <div className="internal-server-error-image -internal-server-error-intro-x">
                    <img alt="Internal Server Error" className="w-[450px] h-48 lg:h-auto" src={errorImage} />
               </div>
               <div className="internal-server-error-content">
                    <div className="internal-server-error-intro-x font-medium text-8xl">500</div>
                    <div className="internal-server-error-intro-x font-medium text-6xl"> Unknow error!. </div>
                    <div className="internal-server-error-intro-x mt-3 text-lg"> But relax! Our cat is here to play you some music.. </div>
                    <div className="internal-server-error-intro-x" style={{ paddingTop: '2rem' }}>
                         <Button severity="info" onClick={() => navigate('/dashboard')}> Back to Dashboard </Button>
                    </div>
               </div>
          </div>
     )
}

export default InternalServerError