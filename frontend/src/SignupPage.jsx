import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/user/signup/', {
        name,
        email,
        password,
      });

      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`회원가입 실패: ${error.response.data.error}`);
      } else {
        setMessage('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">회원가입</button>
      </form>

      {message && <p className="error-message">{message}</p>}

      <div className="signup-footer">
        <a href="/login">이미 계정이 있으신가요? 로그인</a>
      </div>
    </div>
  );
};

export default SignupPage;
