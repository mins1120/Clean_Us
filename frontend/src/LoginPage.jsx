// src/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  // 입력값 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // 로그인 요청 함수
  const handleLogin = async (e) => {
    e.preventDefault();  // 기본 폼 제출 막기

    try {
      const response = await axios.post('http://localhost:8000/user/api/login/', {
        email,
        password,
      }, {
        withCredentials: true,  // 세션 쿠키 저장을 위해 필요
         headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', 
  }
      });

      if (response.data.message === '로그인 성공') {
        const csrfRes = await axios.get('http://localhost:8000/user/csrf/', {
          withCredentials: true
        });


        console.log('📦 현재 document.cookie:', document.cookie);
        // navigate('/'); 
        
        window.location.href = 'http://localhost:3000';
    } else {
      setMessage(response.data.message);
    }
    } 
    
    catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);  // 백엔드 오류 메시지 출력
      } else {
        setMessage("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
