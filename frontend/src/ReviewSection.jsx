import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ReviewSection.css';

function ReviewSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

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

  return (
    <section className="review-section" data-aos="fade-up">
      <p className="review-subtitle">What Our Users Say</p>
      <h2 className="review-title">Review</h2>

      <div className="review-grid">
        {reviews.map((review, index) => (
          <div
            className="review-card"
            key={review.id}
            data-aos="zoom-in"
            data-aos-delay={index * 200} // 0ms, 200ms, 400ms 순차적 등장
          >
            <p className="review-text">{review.text}</p>
            <hr />
            <p className="review-author">{review.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
