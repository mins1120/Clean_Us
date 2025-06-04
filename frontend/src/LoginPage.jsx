// src/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // CSS 파일 import

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/user/api/login/',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.data.message === '로그인 성공') {
        await axios.get('http://localhost:8000/user/csrf/', {
          withCredentials: true,
        });

        localStorage.setItem('isLoggedIn', 'true');
        console.log('📦 현재 document.cookie:', document.cookie);
        window.location.href = '/';
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('서버와 연결할 수 없습니다.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
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
