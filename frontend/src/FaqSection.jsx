import React, { useState } from 'react';
import './FaqSection.css';

const faqs = [
  {
    question: '클린 어스는 어떤 서비스를 제공하나요?',
    answer: '클린 어스는 악성 댓글을 실시간으로 분석하고 필터링하는 서비스를 제공합니다. 이 서비스를 통해 온라인 커뮤니티의 안전성과 신뢰성을 높일 수 있습니다.',
  },
  {
    question: '서비스를 어떻게 시작할 수 있나요?',
    answer: '회원가입 후 로그인하여 클린 어스의 다양한 기능을 이용할 수 있습니다. 구독 옵션을 통해 더욱 향상된 서비스를 제공받을 수 있습니다.',
  },
  {
    question: '필터링 설정은 어떻게 조정할 수 있나요?',
    answer: '사용자는 플랫폼의 특성에 맞게 필터링 설정을 사용자 정의할 수 있습니다. 설정 페이지에서 필요에 맞는 옵션을 선택하세요.',
  },
  {
    question: '사용자 피드백을 어떻게 반영하나요?',
    answer: '사용자의 피드백을 수집하여 필터링 시스템을 지속적으로 개선합니다. 고객의 의견을 반영하여 더 나은 서비스를 제공합니다.',
  },
  {
    question: '악성 댓글이 걸러지지 않으면 어떻게 하나요?',
    answer: '필터링 시스템이 악성 댓글을 놓친 경우, 고객 지원팀에 문의하여 문제를 해결할 수 있습니다. 지속적인 개선을 통해 정확성을 높이고 있습니다.',
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <p className="faq-subtitle">Common Questions</p>
      <h2 className="faq-title">FAQ</h2>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggle(index)}>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              <span>{item.question}</span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
