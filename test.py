import sqlite3

conn = sqlite3.connect('america.sqlite')
cursor = conn.cursor()
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
        print(conn.total_changes)
    except sqlite3.Error as e:
        print(e)

def populate_database():
    global count 
    cursor.execute("CREATE TABLE IF NOT EXISTS example (id INTEGER, name TEXT, age INTEGER)")
    cursor.execute("INSERT INTO example VALUES (%d, 'alice', %d)" % (count, count*10))
    count += 1

def read_data():
    cursor.execute("SELECT * FROM example;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

#create_database()
populate_database()
populate_database()
populate_database()
conn.commit()
read_data()



# def create_sqlite_database(filename):
#     """ create a database connection to an SQLite database """
#     conn = None
#     try:
#         conn = sqlite3.connect(filename)
#         print(sqlite3.sqlite_version)
#     except sqlite3.Error as e:
#         print(e)
#     finally:
#         if conn:
#             conn.close()


# if __name__ == '__main__':
#     create_sqlite_database("my.db")