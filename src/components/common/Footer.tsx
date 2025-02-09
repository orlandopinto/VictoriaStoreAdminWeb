import './footer.css';

const Footer = () => {
     return (
          <div className="footer">
               <div className="container">
                    <div className="d-flex flex-wrap justify-content-between align-items-center py-2 px-4">
                         <div className="col-md-4 d-flex align-items-center">
                              <span className="ps-5 mb-md-0 text-body-secondary">© 2024 Company, Inc</span>
                         </div>

                         <ul className="social-section">
                              <li className="ms-3"><a className="text-body-secondary" href="#"><i className='social-icon pi pi-twitter'></i> </a></li>
                              <li className="ms-3"><a className="text-body-secondary" href="#"><i className='social-icon pi pi-instagram'></i></a></li>
                              <li className="ms-3"><a className="text-body-secondary" href="#"><i className='social-icon pi pi-facebook'></i> </a></li>
                         </ul>
                    </div>
               </div>
          </div>
     )
}

export default Footer