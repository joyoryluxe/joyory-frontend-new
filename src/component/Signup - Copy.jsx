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









