// // import React from 'react';
// // import '../css/Signup/signup.css';
// // import { useNavigate } from 'react-router-dom';

// // const SignUp = () => {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="auth-wrapper">
// //       <div className="auth-left">
// //         <h2>Hi, Welcome To</h2>
// //         <h1>Joyory !!</h1>
// //         <button className="btn sign-in-btn" onClick={() => navigate('/signin')}>
// //           Already a Member? <strong>Sign In</strong> <i className="bi bi-arrow-right"></i>
// //         </button>
// //       </div>

// //       <div className="auth-right">
// //         <div className="form-card">
// //           <h2>Sign up</h2>

// //           <input type="text" placeholder="User Name" className="form-control" />
// //           <input type="email" placeholder="Xyz@gmail.com" className="form-control" />
// //           <input type="password" placeholder="Password" className="form-control" />
// //           <input type="password" placeholder="Confirm Password" className="form-control" />

// //           <button className="btn create-account-btn">Create An Account</button>

// //           <div className="or-divider">Or Continue With</div>
// //           <div className="social-icons">
// //             <i className="bi bi-google"></i>
// //             <i className="bi bi-facebook"></i>
// //             <i className="bi bi-apple"></i>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignUp;




// // src/pages/Signup.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Signup/Signup.css";

// const Signup = () => {
//   const navigate = useNavigate();

//   const handleSignInClick = () => {
//     navigate("/login");
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-left">
//         <h3>Hi, Welcome To</h3>
//         <h1>Joyory <span>!!</span></h1>
//         <p className="already">Already a Member ?</p>
//         <button className="signin-btn" onClick={handleSignInClick}>
//           Sign In <i className="bi bi-arrow-right"></i>
//         </button>
//       </div>

//       <div className="auth-right">
//         <div className="signup-card glass">
//           <h2 className="text-center text-white">Sign up</h2>
//           <form>
//             <div className="main-form-flex">

//             <div>
//             <label className="text-white ms-2">User Name</label>
//             <input type="text" placeholder="User Name" className="form-control mb-3 mt-3" />
//             </div>

//             <div>
//             <label className="text-white ms-2">Email Id</label>
//             <input type="email" placeholder="Xyz@gmail.com" className="form-control mb-3 mt-3" />
//             </div>

//             <div>
//             <label className="text-white ms-2">Password</label>
//             <input type="password" placeholder="**********" className="form-control mb-3 mt-3" />
//             </div>

//             {/* <div>
//             <label className="text-white ms-2">Confirm Password</label>
//             <input type="password" placeholder="**********" className="form-control mb-4 mt-3" />
//             </div> */}

//             </div>
            
//             <button className="submit-btn">Create An Account</button>
//           </form>

//           <div className="divider-line mt-4 mb-3"></div>
//           <p className="text-center mb-2">Or Continue With</p>
//           <div className="social-icons text-center">
//             <i className="bi bi-google"></i>
//             <i className="bi bi-facebook mx-3"></i>
//             <i className="bi bi-apple"></i>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from 'react';
// import '../css/Login.css';
import '../css/Signup/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import { Link, useNavigate } from 'react-router-dom';



const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordType(prev => (prev === 'password' ? 'text' : 'password'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // ✅ If valid, redirect
    navigate('/Home');
  };

  return (
    <div className="login-wrapper">
      <div className="login-left flex-column jutify-content-start">
        <h1>Hi,<br />Welcome Back</h1>
         <button className="signin-btn" >
           Sign In <i className="bi bi-arrow-right"></i>
         </button>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className='signup'>
            <h2>Sign In</h2>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>User Name</label>
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleChange}
              required
            />

             <label>Email id</label>
            <input
              type="text"
              name="username"
              placeholder="Email id"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <div className="password-field">
              <input
                type={passwordType}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span onClick={togglePassword} className="password-toggle">
                {passwordType === 'password' ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </span>
            </div>

            {/* <div className="forgot">Forgot Password?</div> */}

            <div className="forgot">
              <Link to="/ForgotPassword">Forgot Password?</Link>
            </div>


            <button type="submit">Submit</button>
          </form>

          <div className="divider">Or Continue With</div>
          <div className="social-icons">
            <i className="bi bi-google"></i>
            <i className="bi bi-facebook"></i>
            <i className="bi bi-apple"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;









