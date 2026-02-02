import json
import math

def load_scriptures(path="rag-data/scriptures.json"):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def text_similarity(a, b):
    a_words = set(a.lower().split())
    b_words = set(b.lower().split())
    if not a_words or not b_words:
        return 0
    return len(a_words & b_words) / len(a_words | b_words)

def retrieve_relevant_scriptures(user_query, top_k=3):
    scriptures = load_scriptures()
    scored = []

    for verse in scriptures:
        topic_score = max(
            [text_similarity(user_query, topic) for topic in verse.get("topics", [])],
            default=0
        )
        text_score = text_similarity(user_query, verse.get("text", ""))
        total_score = (0.7 * topic_score) + (0.3 * text_score)

        if total_score > 0:
            scored.append((total_score, verse))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [v for _, v in scored[:top_k]]