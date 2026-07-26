import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { ApiService } from '../services/apiService';

export default function SignupScreen({ onSignupSuccess, onNavigateToLogin, showToast }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      showToast('Please agree to the Terms and Conditions');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showToast('Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await ApiService.register(
        fullName.trim(),
        email.trim(),
        phone.trim(),
        password.trim()
      );

      if (result.statusCode === 200 || result.statusCode === 201) {
        showToast('Account created successfully');
        onSignupSuccess();
      } else {
        const errorMsg = result.data?.detail || 'Signup failed';
        showToast(errorMsg);
      }
    } catch (err) {
      showToast('An error occurred: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-screen fade-in">
      <div className="signup-content">
        {/* Header */}
        <div className="header-section">
          <h1 className="brand-header">SKILL<br />SNAP</h1>
          <p className="brand-subheader">
            Skill Snap AI - Powered<br />Learning & Career Guidance
          </p>
        </div>

        {/* Form Container */}
        <div className="form-box">
          <h2 className="form-title">User Sign Up</h2>

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="input-group">
              <span className="input-icon-left">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email Address */}
            <div className="input-group">
              <span className="input-icon-left">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className="input-group">
              <span className="input-icon-left">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                placeholder="Phone Number"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="agree-signup"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="custom-checkbox"
              />
              <label htmlFor="agree-signup" className="checkbox-label">
                I agree to the <span className="underline-blue">Terms and Conditions</span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner" />
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Already have account */}
            <div className="login-link-container">
              <span className="login-link" onClick={onNavigateToLogin}>
                Already have an account? Click here
              </span>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .signup-screen {
          background-color: #a8c3e8;
          height: 100%;
          width: 100%;
          padding: 16px 12px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .signup-screen::-webkit-scrollbar {
          display: none;
        }
        
        .signup-content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          justify-content: flex-start;
        }
        
        .header-section {
          text-align: center;
          margin-top: 12px;
          margin-bottom: 25px;
        }
        
        .brand-header {
          font-size: 32px;
          font-weight: 800;
          line-height: 1.0;
          color: #ffffff;
          letter-spacing: 0.5px;
        }
        
        .brand-subheader {
          font-size: 15px;
          font-weight: 700;
          color: #234d8a;
          margin-top: 10px;
          line-height: 1.3;
        }
        
        .form-box {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 20px 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        
        .form-title {
          font-size: 20px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 18px;
        }
        
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 0 16px 0;
        }
        
        .custom-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .checkbox-label {
          font-size: 13px;
          color: #000000;
          line-height: 1.2;
          cursor: pointer;
        }
        
        .underline-blue {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .signup-btn {
          width: 100%;
          height: 48px;
          border-radius: 24px;
          background-color: #a8e2de;
          color: rgba(0, 0, 0, 0.8);
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        
        .signup-btn:hover {
          filter: brightness(0.97);
        }
        
        .signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .login-link-container {
          text-align: center;
          margin-top: 14px;
        }
        
        .login-link {
          font-size: 13px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.8);
          cursor: pointer;
        }
        
        .login-link:hover {
          text-decoration: underline;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top: 2px solid rgba(0,0,0,0.8);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
