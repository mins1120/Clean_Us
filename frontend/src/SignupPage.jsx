// src/SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  // 1. 입력값 상태 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate(); // 페이지 이동용

  // 2. 폼 전송 시 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 3. Django 백엔드에 회원가입 요청
      const response = await axios.post('http://localhost:8000/user/signup/', {
        name,
        email,
        password,
      });

      alert('회원가입 성공!');
      navigate('/login'); // 로그인 페이지로 이동

    } catch (error) {
  console.error(error);
  if (error.response && error.response.data && error.response.data.error) {
    alert(`회원가입 실패: ${error.response.data.error}`);
  } else {
    alert('회원가입에 실패했습니다.');
  }
}

  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
