def check_offensive(text):
    bad_words = ['씨발', '꺼져', 'ㅂㅅ', '멍청이']
    found = [word for word in bad_words if word in text]
    return (len(found) > 0, ', '.join(found))