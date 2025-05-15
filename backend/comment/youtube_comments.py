import requests
from datetime import datetime

def get_youtube_comments(video_id, api_key, max_results=10):
    url = 'https://www.googleapis.com/youtube/v3/commentThreads'
    params = {
        'key': api_key,
        'textFormat': 'plainText',
        'part': 'snippet',
        'videoId': video_id,
        'maxResults': max_results
    }

    response = requests.get(url, params=params)
    try:
        data = response.json()
    except ValueError:
        return []

    comments = []
    for item in data.get('items', []):
        snippet = item['snippet']['topLevelComment']['snippet']
        comment_data = {
            'content': snippet['textDisplay'],
            'author': snippet['authorDisplayName'],
            'published_at': snippet['publishedAt'],  # ex: '2025-05-15T03:32:26Z'
        }
        comments.append(comment_data)
    return comments