import sqlite3
import os
from datetime import datetime

# יצירת נתיב מוחלט לתיקיית SQL בתוך תיקיית MyData
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
sql_dir = os.path.join(project_dir, "SQL")
path_name = os.path.join(sql_dir, "Mydb.db")

if not os.path.exists(sql_dir):
    os.makedirs(sql_dir)

class User_Animals_Model:

    @staticmethod
    def get_db_connection():
        return sqlite3.connect(path_name)
    
    @staticmethod
    def create_table():
        with User_Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''create table if not exists user_animals (
                id integer primary key autoincrement,
                user_id integer not null,
                animal_id integer not null,
                purchased_at datetime default current_timestamp,
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (animal_id) REFERENCES animals(animal_id),
                UNIQUE(user_id, animal_id)
                )'''
            cursor.execute(sql)
            connection.commit()
            cursor.close()

    @staticmethod
    def purchase_animal(user_id, animal_id):
        with User_Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            
            # בדוק אם המשתמש כבר קנה את החיה
            sql = "SELECT id FROM user_animals WHERE user_id = ? AND animal_id = ?"
            cursor.execute(sql, (user_id, animal_id))
            existing = cursor.fetchone()
            
            if existing:
                cursor.close()
                return {"Error": "Animal already purchased"}
            
            # הוסף את החיה למשתמש
            sql = "INSERT INTO user_animals (user_id, animal_id) VALUES (?, ?)"
            cursor.execute(sql, (user_id, animal_id))
            connection.commit()
            purchase_id = cursor.lastrowid
            cursor.close()
            
            return {
                "Message": "Animal purchased successfully",
                "purchase_id": purchase_id,
                "user_id": user_id,
                "animal_id": animal_id
            }

    @staticmethod
    def get_user_animals(user_id):
        with User_Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''SELECT ua.id, ua.purchased_at, a.animal_id, a.name, a.emoji, a.price, a.category
                    FROM user_animals ua
                    JOIN animals a ON ua.animal_id = a.animal_id
                    WHERE ua.user_id = ?
                    ORDER BY ua.purchased_at DESC'''
            cursor.execute(sql, (user_id,))
            animals = cursor.fetchall()
            cursor.close()
            
            if not animals:
                return {"Message": "No animals purchased yet"}
                
            return [
                {
                    "purchase_id": row[0],
                    "purchased_at": row[1],
                    "animal_id": row[2],
                    "name": row[3],
                    "emoji": row[4],
                    "price": row[5],
                    "category": row[6]
                }
                for row in animals
            ]

    @staticmethod
    def check_user_owns_animal(user_id, animal_id):
        with User_Animals_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "SELECT id FROM user_animals WHERE user_id = ? AND animal_id = ?"
            cursor.execute(sql, (user_id, animal_id))
            result = cursor.fetchone()
            cursor.close()
            return result is not None
