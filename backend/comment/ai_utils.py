# comment/ai_utils.py

def check_offensive(text):
    """
    입력된 텍스트가 욕설/성희롱/혐오 중 어느 카테고리에 해당하는지 분류.
    카테고리에 해당하지 않으면 정상으로 처리.
    """

    categories = {
        "혐오욕설": ["지랄염병"],
        "성차별": ["개줌마"],
        "정치성향차별": ["국개의원"]
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
