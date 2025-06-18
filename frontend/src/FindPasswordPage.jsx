import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // 기존 로그인 스타일 재사용

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/user/api/password-reset-request/',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (error) {
      setMessage('오류가 발생했습니다. 이메일 주소를 확인해주세요.');
      console.error('비밀번호 재설정 요청 오류:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit}>
        <label>이메일 주소</label>
        <input
          type="email"
          placeholder="가입 시 사용한 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">재설정 링크 보내기</button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default FindPasswordPage;
