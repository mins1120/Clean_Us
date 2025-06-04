// src/components/ChangePassword.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from './utils/csrf';
import './ChangePassword.css';

export default function ChangePassword({ onSuccess }) {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd1, setNewPwd1] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});

    const csrftoken = getCookie('csrftoken');
    try {
      const res = await axios.post(
        'http://localhost:8000/user/api/password/',
        {
          old_password: oldPwd,
          new_password1: newPwd1,
          new_password2: newPwd2,
        },
        {
          withCredentials: true,
          headers: { 'X-CSRFToken': csrftoken }
        }
      );
      alert(res.data.message);
      onSuccess();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err);
        alert('오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="cp-wrapper">
      <h3 className="cp-title">비밀번호 변경</h3>
      <form onSubmit={handleSubmit} className="cp-form">
        <div className="cp-group">
          <label className="cp-label">현재 비밀번호</label>
          <input
            type="password"
            value={oldPwd}
            onChange={e => setOldPwd(e.target.value)}
            className="cp-input"
          />
          {errors.old_password && (
            <p className="cp-error">{errors.old_password}</p>
          )}
        </div>
        <div className="cp-group">
          <label className="cp-label">새 비밀번호</label>
          <input
            type="password"
            value={newPwd1}
            onChange={e => setNewPwd1(e.target.value)}
            className="cp-input"
          />
          {errors.new_password1 && (
            <p className="cp-error">{errors.new_password1}</p>
          )}
        </div>
        <div className="cp-group">
          <label className="cp-label">새 비밀번호 확인</label>
          <input
            type="password"
            value={newPwd2}
            onChange={e => setNewPwd2(e.target.value)}
            className="cp-input"
          />
          {errors.new_password2 && (
            <p className="cp-error">{errors.new_password2}</p>
          )}
        </div>
        <div className="cp-btn-wrapper">
          <button type="submit" className="cp-btn">비밀번호 변경</button>
        </div>
      </form>
    </div>
  );
}
