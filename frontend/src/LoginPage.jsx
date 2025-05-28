// src/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/user/api/login/', {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.data.message === '로그인 성공') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/';
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>아이디</label>
        <input
          type="email"
          placeholder="이메일을 입력해 주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>

      <div className="login-footer">
        <a href="/signup">회원가입</a>
        <a href="#">아이디/비밀번호 찾기</a>
      </div>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default LoginPage;
