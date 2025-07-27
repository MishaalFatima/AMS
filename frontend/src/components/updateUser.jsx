import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function updateUser() {

    const location = useLocation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const user = location.state ? location.state.user : null;
  
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    useEffect(() => {
        if (user) {
          setId(user.id);
          setName(user.r_user_name);
          setEmail(user.r_user_email);
          setStatus(user.r_user_status);
          setPassword(user.r_user_password);
        }
      }, [user]);
    
      const updateUser = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/updateUser/${id}", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              r_user_name: name,
              r_user_email: email,
              r_user_status: status,
              r_user_password: newPassword ? newPassword : password,
            }),
          });

          if (response.ok) {
            navigate('/admin');
          } else {
            console.error('Failed to update user', await response.json());
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        updateUser();
      };
      const onConfirmLogout = () => {
        Cookies.remove('auth_token');
        window.location.replace('/sign-in');
      };
    
      const toggleShowPassword = () => {
        setShowPassword(!showPassword);
      };
    
      const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
      };
      
      const handleLogout = () => {
        setModalIsOpen(true);
      };
    
      const toggleModal = () => {
        setModalIsOpen(false);
      };
    
    
  
  return (
    <div>
    <section class="vh-100">
<div class="container h-100">
  <div class="row d-flex justify-content-center align-items-center h-100">
    <div class="col-lg-12 col-xl-11">
      <div class="card text-black" style={{borderradius: 25}}>
        <div class="card-body p-md-5">
          <div class="row justify-content-center">
            <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

              <p class="text-center h1 fw-bold mb-3 mx-md-4 mt-2" style={{color:'#c6200e'}}>
              Sign Up</p>
              <form class="mx-1 mx-md-4">

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faUser} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                    name='UserName'
                    type="text"
                    id="form3Example1c" 
                    placeholder='UserName' 
                    class="form-control" 
                    onChange={(e)=>changeHandler(e)}
                    />
                  </div>
                </div>

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faEnvelope} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='email' 
                     type="email" 
                     id="form3Example3c" 
                     placeholder='Your Email' 
                     class="form-control" 
                     onChange={(e)=>changeHandler(e)}
                     />
                  </div>
                </div>

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faUser} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='role' 
                     type="text" 
                     id="form3Example8c" 
                     placeholder='Your Role' 
                     class="form-control" 
                     onChange={(e)=>changeHandler(e)}
                     />
                  </div>
                </div>
                
                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faPen} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='speciality' 
                     type="text" 
                     id="form3Example6c" 
                     placeholder='Your speciality' 
                     class="form-control" 
                     onChange={(e)=>changeHandler(e)}
                     />
                  </div>
                </div>

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faLock} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='password' 
                     type="password" 
                     id="form3Example4c" 
                     placeholder='Password' 
                     class="form-control"
                     onChange={(e)=>changeHandler(e)}
                     />
                    
                  </div>
                </div>

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faKey} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='repeatPassword' 
                     type="password" 
                     id="form3Example4cd" 
                     placeholder='Repeat your password' 
                     class="form-control" 
                     onChange={(e)=>changeHandler(e)}
                     />
                  </div>
                </div>

                <div class="d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon className='mx-2' icon={faFile} />
                  <div data-mdb-input-init class="form-outline flex-fill mb-0">
                    <input
                     name='imgUri' 
                     type="file" 
                     id="form3Example7cd" 
                     class="form-control" 
                     onChange={e=>fileChangeHandler(e)}
                     />
                  </div>
                </div>

                <div class="form-check d-flex justify-content-center mb-3 mr-5">
                  <input 
                  class="form-check-input me-2" 
                  type="checkbox" value="" 
                  id="form2Example3c"
                  />
                  <label class="form-check-label" for="form2Example3">
                    I agree all statements in <a href="#!">Terms of service</a>
                  </label>
                </div>

                <div >
                  <img src={imgUri} width="50%"
                  />
                </div>

                <div class="d-flex justify-content-center mt-5 mx-4 mb-lg-4">
                  <button type="button" 
                  data-mdb-button-init 
                  data-mdb-ripple-init
                  class="btn btn-info px-5"
                  onClick={(e)=>SubmitHandler(e)}
                 >
                  Register
                  
                  </button>
                </div>

              </form>

            </div>
            <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

              <img src={imag} style={{height:500}} alt="Sample image"
                class="img-fluid" />

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
  </div>
  );
}


export default updateUser;
