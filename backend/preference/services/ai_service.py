# backend/preference/services/ai_service.py
from pathlib import Path
from typing import List, Dict, Any

import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# ────────────────────────────────────────────────
# 1️⃣ EC2 절대경로
# 실제 모델 폴더: /home/ec2-user/workspaces/cleanus-model/models/kobert-20250811-121040/final
# ────────────────────────────────────────────────
MODEL_PATH = Path("/home/ec2-user/workspaces/cleanus-model/models/kobert-20250811-121040/final")

# ────────────────────────────────────────────────
# 2️⃣ 모델 로드 (서버 시작 시 1회만)
# ────────────────────────────────────────────────
tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH), use_fast=False)
model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
model.eval()

# ────────────────────────────────────────────────
# 3️⃣ 설정값
# ────────────────────────────────────────────────
# 민감도별 Threshold
THRESHOLDS: Dict[int, float] = {1: 0.85, 2: 0.65, 3: 0.45}
# 테스트용 금칙어 (운영 시 DB나 사용자 설정으로 대체)
DEFAULT_BLOCKED: List[str] = ["병신", "시발"]

# ────────────────────────────────────────────────
# 4️⃣ 로직 구현
# ────────────────────────────────────────────────
def keyword_filtering(text: str, blocked_keywords: List[str], weight: int = 2) -> Dict[str, Any]:
    """간단 문자열 포함 기반 가중치 보정"""
    hit = any(kw in text for kw in blocked_keywords)
    return {"contains_keyword": hit, "adjustment": 0.05 * weight if hit else 0.0}


def apply_personalization(base_conf: float, keyword_adj: float) -> float:
    """키워드 기반 confidence 보정"""
    return min(1.0, base_conf + keyword_adj)


def _predict_raw(text: str) -> Dict[str, Any]:
    """KoBERT 분류기 순수 추론 (라벨/확률)"""
    if not isinstance(text, str):
        raise ValueError("text must be a string")

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=-1)
        base_label = torch.argmax(probs, dim=1).item()
        base_conf = probs[0][base_label].item()
    return {"base_label": int(base_label), "base_confidence": float(base_conf)}


def predict(text: str, sensitivity: int = 2, blocked_keywords: List[str] | None = None) -> Dict[str, Any]:
    """
    최종 API 호출용
    - sensitivity: 1(약)/2(중)/3(강)
    - blocked_keywords: 사용자 지정 금칙어
    """
    raw = _predict_raw(text)
    kw = keyword_filtering(text, blocked_keywords or DEFAULT_BLOCKED, sensitivity)
    adjusted_conf = apply_personalization(raw["base_confidence"], kw["adjustment"])

    threshold = THRESHOLDS.get(sensitivity, THRESHOLDS[2])

    # ⚙ 라벨 매핑: 0=비악성, 1=악성
    # 모델에서 나온 base_label 그대로 사용 (0=Normal, 1=Malicious)
    # threshold/keyword를 반영한 최종 결과
    final_label = 1 if (adjusted_conf >= threshold or kw["contains_keyword"]) else 0

    return {
        "text": text,
        "pred_label": int(final_label),
        "base_confidence": round(raw["base_confidence"], 4),
        "adjusted_confidence": round(adjusted_conf, 4),
        "contains_keyword": bool(kw["contains_keyword"]),
        "sensitivity": int(sensitivity),
        "threshold": float(threshold),
        "blocked_keywords": blocked_keywords or DEFAULT_BLOCKED,
    }
