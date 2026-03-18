import sqlite3

db_path = 'comment-rate-service/comment_rate_service/db.sqlite3'
conn = sqlite3.connect(db_path)
c = conn.cursor()

reviews = {
    1: 'Great introductory book, very easy to follow and practice.',
    2: 'Practical content, very useful for code review.',
    3: 'Suitable if you already have a Python background.',
    4: 'A must-read for every programmer.',
    5: 'Great introductory book, very easy to follow and practice.',
    6: 'Practical content, very useful for code review.',
    7: 'Suitable if you already have a Python background.',
    8: 'A must-read for every programmer.',
    9: 'A bedside book for every programmer. Highly recommended.',
    10: 'Good book for anyone who wants to understand Python deeply.',
    11: 'A terrifyingly realistic classic.'
}

for r_id, comment in reviews.items():
    c.execute('UPDATE app_review SET comment=? WHERE id=?', (comment, r_id))

conn.commit()
conn.close()

print('Updated reviews to English')
