import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ApiService } from '../services/apiService';

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      showToast('Please agree to the Terms and Conditions');
      return;
    }

    if (!email.trim() || !password.trim()) {
      showToast('Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await ApiService.login(email.trim(), password.trim());

      if (result.statusCode === 200) {
        showToast('Login successful');
        onLoginSuccess(result.data.user);
      } else {
        const errorMsg = result.data?.detail || 'Login failed';
        showToast(errorMsg);
      }
    } catch (err) {
      showToast('An error occurred: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen fade-in">
      <div className="login-content">
        {/* Title & Header */}
        <div className="header-section">
          <h1 className="brand-header">SKILL<br />SNAP</h1>
          <p className="brand-subheader">
            Skill Snap AI - Powered<br />Learning & Career Guidance
          </p>
        </div>

        {/* Form Container */}
        <div className="form-box">
          <h2 className="form-title">User Login</h2>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
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

            {/* Password Field */}
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
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="custom-checkbox"
              />
              <label htmlFor="agree" className="checkbox-label">
                I agree to the <span className="underline-blue">Terms and Conditions</span>
              </label>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner" />
              ) : (
                'Login'
              )}
            </button>

            {/* Navigation Link */}
            <div className="signup-link-container">
              <span className="signup-link" onClick={onNavigateToSignup}>
                New to Skill Snap? Click here
              </span>
            </div>
          </form>
        </div>

        {/* Forget Password */}
        <div className="forget-password-container">
          <span className="forget-password">Forget Password?</span>
        </div>
      </div>

      <style>{`
        .login-screen {
          background-color: #a8c3e8;
          height: 100%;
          width: 100%;
          padding: 16px 12px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .login-screen::-webkit-scrollbar {
          display: none;
        }
        
        .login-content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          justify-content: flex-start;
        }
        
        .header-section {
          text-align: center;
          margin-top: 12px;
          margin-bottom: 30px;
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
        
        .login-btn {
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
        
        .login-btn:hover {
          filter: brightness(0.97);
        }
        
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .signup-link-container {
          text-align: center;
          margin-top: 14px;
        }
        
        .signup-link {
          font-size: 13px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.8);
          cursor: pointer;
        }
        
        .signup-link:hover {
          text-decoration: underline;
        }
        
        .forget-password-container {
          padding-left: 4px;
          margin-bottom: 20px;
        }
        
        .forget-password {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.54);
          cursor: pointer;
        }
        
        .forget-password:hover {
          color: rgba(0, 0, 0, 0.8);
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
