# comment/ai_utils.py

def check_offensive(text):
    """
    입력된 텍스트가 욕설/성희롱/혐오 중 어느 카테고리에 해당하는지 분류.
    카테고리에 해당하지 않으면 정상으로 처리.
    """

    categories = {
        "욕설": ["씨발", "꺼져", "ㅂㅅ", "멍청이", "개병신", "병신", "새끼", "닥쳐", "좆", "시발", "븅신", "존나"],
        "성희롱": ["섹스","자지","보지","허벅지가 매력적이네요"],
        "혐오": ["장애인","니거","한남","한녀","한남유충","몰카충","혐오스럽다", "성추행당할위인이냐","짱개"]
    }

    detected_category = None

    for category, keywords in categories.items():
        for word in keywords:
            if word in text:
                detected_category = category
                break  # 첫 번째로 발견된 카테고리만 반환
        if detected_category:
            break

    if detected_category:
        return True, detected_category
    else:
        return False, None
