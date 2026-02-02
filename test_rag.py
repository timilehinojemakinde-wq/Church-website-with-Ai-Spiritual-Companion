from rag_engine import retrieve_relevant_scriptures

query = "I am confused about my career and future"
results = retrieve_relevant_scriptures(query)

for r in results:
    print(f"{r['book']} {r['chapter']}:{r['verses']}")
    print(r["text"])
    print("-" * 40)