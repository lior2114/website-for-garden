import sqlite3
import os

# יצירת נתיב מוחלט לתיקיית SQL בתוך תיקיית MyData
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
sql_dir = os.path.join(project_dir, "SQL")
path_name = os.path.join(sql_dir, "Mydb.db")

if not os.path.exists(sql_dir):
    os.makedirs(sql_dir)

class Animals_Model:

    @staticmethod
    def get_db_connection():
        return sqlite3.connect(path_name)
    
    @staticmethod
    def create_table():
        with Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''create table if not exists animals (
                animal_id integer primary key autoincrement,
                name text not null,
                emoji text not null,
                price integer not null,
                category text not null
                )'''
            cursor.execute(sql)
            connection.commit()
            cursor.close()

    @staticmethod
    def insert_default_animals():
        animals_data = [
            ("כלב", "🐶", 5, "חיות בית"),
            ("חתול", "🐱", 5, "חיות בית"), 
            ("ארנב", "🐰", 8, "חיות בית"),
            ("אוגר", "🐹", 6, "חיות בית"),
            ("אריה", "🦁", 15, "חיות בר"),
            ("נמר", "🐯", 15, "חיות בר"),
            ("פיל", "🐘", 20, "חיות בר"),
            ("זברה", "🦓", 12, "חיות בר"),
            ("ג'ירף", "🦒", 18, "חיות בר"),
            ("קוף", "🐒", 10, "חיות בר"),
            ("דולפין", "🐬", 25, "חיות ים"),
            ("לוויתן", "🐋", 30, "חיות ים"),
            ("דג", "🐟", 3, "חיות ים"),
            ("צב", "🐢", 8, "חיות ים"),
            ("פינגווין", "🐧", 12, "חיות קוטב"),
            ("דוב לבן", "🐻‍❄️", 20, "חיות קוטב"),
            ("צבי", "🦌", 15, "חיות יער"),
            ("דב", "🐻", 18, "חיות יער"),
            ("שועל", "🦊", 14, "חיות יער"),
            ("זאב", "🐺", 16, "חיות יער")
        ]
        
        with Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            # בדוק אם כבר יש חיות
            cursor.execute("SELECT COUNT(*) FROM animals")
            count = cursor.fetchone()[0]
            
            if count == 0:  # רק אם אין חיות
                sql = "INSERT INTO animals (name, emoji, price, category) VALUES (?, ?, ?, ?)"
                cursor.executemany(sql, animals_data)
                connection.commit()
            cursor.close()

    @staticmethod
    def get_all_animals():
        with Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "SELECT * FROM animals ORDER BY category, price"
            cursor.execute(sql)
            animals = cursor.fetchall()
            cursor.close()
            if not animals:
                return {"Message": "No animals found"}
            return [
                {
                    "animal_id": row[0],
                    "name": row[1],
                    "emoji": row[2], 
                    "price": row[3],
                    "category": row[4]
                }
                for row in animals
            ]

    @staticmethod
    def get_animal_by_id(animal_id):
        with Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "SELECT * FROM animals WHERE animal_id = ?"
            cursor.execute(sql, (animal_id,))
            animal = cursor.fetchone()
            cursor.close()
            if not animal:
                return None
            return {
                "animal_id": animal[0],
                "name": animal[1],
                "emoji": animal[2],
                "price": animal[3],
                "category": animal[4]
            }
