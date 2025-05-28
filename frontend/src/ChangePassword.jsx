// src/components/ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from './utils/csrf';

export default function ChangePassword({ onSuccess }) {
  const [oldPwd,  setOldPwd]  = useState('');
  const [newPwd1, setNewPwd1] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [errors,  setErrors]  = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});

    const csrftoken = getCookie('csrftoken');
    try {
      const res = await axios.post(
        'http://localhost:8000/user/api/password/',
        {
          old_password:  oldPwd,
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
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-3">비밀번호 변경</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">현재 비밀번호</label>
          <input
            type="password"
            value={oldPwd}
            onChange={e => setOldPwd(e.target.value)}
            className="w-full border px-2 py-1"
          />
          {errors.old_password && (
            <p className="text-red-500 text-sm">{errors.old_password}</p>
          )}
        </div>
        <div className="mb-2">
          <label className="block mb-1">새 비밀번호</label>
          <input
            type="password"
            value={newPwd1}
            onChange={e => setNewPwd1(e.target.value)}
            className="w-full border px-2 py-1"
          />
          {errors.new_password1 && (
            <p className="text-red-500 text-sm">{errors.new_password1}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            value={newPwd2}
            onChange={e => setNewPwd2(e.target.value)}
            className="w-full border px-2 py-1"
          />
          {errors.new_password2 && (
            <p className="text-red-500 text-sm">{errors.new_password2}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            변경하기
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
