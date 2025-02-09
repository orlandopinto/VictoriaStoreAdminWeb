import { useNavigate } from 'react-router-dom';
//import './PageNotFound.css';

function PageNotFound() {
     const navigate = useNavigate();
     return (
          <>
               <div className="cont_principal cont_error_active">
                    <div className="cont_error">
                         <h1>Oops</h1>
                         <p>The Page you're looking for isn't here.</p>
                         <button onClick={() => navigate(-1)} >Volver</button>
                         <button onClick={() => navigate('/account/login')} >Login</button>
                    </div>
                    <div className="cont_aura_1"></div>
                    <div className="cont_aura_2"></div>
               </div>
          </>
     )
}

export default PageNotFound