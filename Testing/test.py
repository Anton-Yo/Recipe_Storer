import sqlite3
import os

conn = sqlite3.connect('example.db')
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS example (id INTEGER, name TEXT, age INTEGER)")
count = 0
databaseCreated = False
x = 0

def test():
    global x
    x = x + 3
    print(x)

def create_database(filename):
    #create connection to a database
    try:
        conn = sqlite3.connect(filename)
        print(sqlite3.sqlite_version)
        
    except sqlite3.Error as e:
        print(e)


def populate_database():
    global count 
    cursor.execute("INSERT INTO example VALUES (%d, 'alice', %d)" % (count, count*10))
    count += 1

def read_data():
    cursor.execute("SELECT * FROM example;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

def delete_data():
    cursor.execute("DROP table example")

populate_database()
populate_database()
populate_database()
read_data()
print(conn.total_changes)
#delete_data()
conn.commit()
conn.close()



