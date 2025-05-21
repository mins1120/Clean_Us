import React from 'react';
import './FeatureSection.css';

function FeatureSection() {
  return (
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
  );
}

export default FeatureSection;