// MainPage.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './MainPage.css'; // ✅ 통합된 CSS 파일

function MainPage() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1200, once: false, mirror: true });
    AOS.refresh();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const reviews = [
    {
      id: 1,
      text: '클린 어스 서비스를 사용한 후, 우리 커뮤니티는 더욱 안전하고 긍정적인 공간이 되었습니다. 악성 댓글이 줄어들어 사용자들이 더욱 활발하게 참여하고 있습니다.',
      author: 'soo**',
    },
    {
      id: 2,
      text: '처음에는 회의적이었지만, 클린 어스의 필터링 기능이 얼마나 효과적인지 경험하게 되었습니다. 사용자 경험이 눈에 띄게 좋아졌습니다. 정말 감사합니다!',
      author: 'laz***',
    },
    {
      id: 3,
      text: '우리 플랫폼에서 악성 댓글이 사라지면서, 사용자들이 더욱 자유롭게 의견을 나누고 있습니다. 클린 어스 덕분에 긍정적인 변화가 일어났습니다.',
      author: 'myd*****',
    },
  ];

  const faqs = [
    {
      question: '클린어스는 어떤 서비스를 제공하나요?',
      answer: '클린어스는 악성 댓글을 실시간으로 분석하고 필터링하는 서비스를 제공합니다. 이 서비스를 통해 온라인 커뮤니티의 안전성과 신뢰성을 높일 수 있습니다.',
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

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('/img/mainimg.jpg')`,
          height: '70vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: 'white',
          paddingLeft: '15%',
        }}
      >
        <div className="overlay" />
        <div className="hero-content" data-aos="fade-up">
          <p className="tagline">Clean Up Your Comments</p>
          <h1>
            악성 댓글을 걸러내다
            <br />
            서비스로 깨끗한 환경
          </h1>
          <button className="start-button">시작하기</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="scroll-text-container">
          <h2 className="scroll-text">About Clean Us About Clean Us</h2>
        </div>
        <div className="about-body">
          <div className="about-image-wrapper" data-aos="zoom-in">
            <img src={`${process.env.PUBLIC_URL}/img/section2.jpeg`} alt="About Clean Us" />
          </div>
          <div className="mission-content">
            <div className="mission-item" data-aos="fade-up" data-aos-delay="0">
              <h3>01 <span>Mission</span></h3>
              <p>우리는 온라인 커뮤니티의 긍정적이고 안전한 환경을 조성하는 데 중점을 둡니다.</p>
            </div>
            <div className="mission-item" data-aos="fade-up" data-aos-delay="200">
              <h3>02 <span>Vision</span></h3>
              <p>모든 온라인 플랫폼에서 악성 댓글이 없는 환경을 만드는 것이 우리의 목표입니다.</p>
            </div>
            <div className="mission-item" data-aos="fade-up" data-aos-delay="400">
              <h3>03 <span>Values</span></h3>
              <p>신뢰, 혁신, 그리고 사용자 중심의 접근 방식을 통해 커뮤니티를 보호합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Function Section */}
      <section className="main-function-section" data-aos="fade-up">
        <p className="sub-title">Clean Us</p>
        <h2 className="main-title">MAIN FUNCTION</h2>
        <div className="function-grid">
          <div className="function-item" data-aos="fade-up" data-aos-delay="0">
            <img src={`${process.env.PUBLIC_URL}/img/section3_1.jpeg`} alt="실시간 댓글 분석" />
            <p>실시간 댓글 분석</p>
          </div>
          <div className="function-item" data-aos="fade-up" data-aos-delay="200">
            <img src={`${process.env.PUBLIC_URL}/img/section3_2.jpeg`} alt="관리 페이지" />
            <p>관리 페이지</p>
          </div>
          <div className="function-item" data-aos="fade-up" data-aos-delay="400">
            <img src={`${process.env.PUBLIC_URL}/img/section3_3.jpeg`} alt="사용자 피드백" />
            <p>사용자 피드백</p>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature-section">
        <div className="feature-header" data-aos="fade-up">
          <p className="feature-subtitle">Advanced Filtering System</p>
          <h2 className="feature-title">Features</h2>
        </div>
        <div className="feature-content">
          <div className="feature-image" data-aos="fade-right">
            <img src={`${process.env.PUBLIC_URL}/img/section4.jpeg`} alt="AI robot" />
          </div>
          <div className="feature-details">
            <div className="feature-item" data-aos="fade-up" data-aos-delay="100">
              <span className="feature-number">01</span>
              <div>
                <h4>Real-Time Analysis</h4>
                <p>실시간으로 댓글을 분석하여 악성 댓글을 즉시 식별하고 차단합니다.</p>
              </div>
            </div>
            <div className="feature-item" data-aos="fade-up" data-aos-delay="300">
              <span className="feature-number">02</span>
              <div>
                <h4>User Feedback Integration</h4>
                <p>사용자의 피드백을 통합하여 필터링 시스템을 지속적으로 개선합니다.</p>
              </div>
            </div>
            <div className="feature-item" data-aos="fade-up" data-aos-delay="500">
              <span className="feature-number">03</span>
              <div>
                <h4>Customizable Settings</h4>
                <p>플랫폼의 특성에 맞게 필터링 설정을 사용자가 정의할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="review-section" data-aos="fade-up">
        <p className="review-subtitle">What Our Users Say</p>
        <h2 className="review-title">Review</h2>
        <div className="review-grid">
          {reviews.map((review, index) => (
            <div
              className="review-card"
              key={review.id}
              data-aos="zoom-in"
              data-aos-delay={index * 200}
            >
              <p className="review-text">{review.text}</p>
              <hr />
              <p className="review-author">{review.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
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
    </div>
  );
}

export default MainPage;
