import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // 기존 스타일 재사용

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/user/api/password-reset-confirm/',
        {
          uid,
          token,
          new_password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => navigate('/login'), 2000); // 2초 후 로그인 페이지로 이동
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('비밀번호 변경 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>새 비밀번호 설정</h2>
      <form onSubmit={handleReset}>
        <label>새 비밀번호</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">비밀번호 재설정</button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
