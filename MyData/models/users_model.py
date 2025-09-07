import sqlite3
import os
# יצירת נתיב מוחלט לתיקיית SQL בתוך תיקיית MyData
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
sql_dir = os.path.join(project_dir, "SQL")
path_name = os.path.join(sql_dir, "Mydb.db")

if not os.path.exists(sql_dir):
    os.makedirs(sql_dir)

class Users_Model:

    @staticmethod
    def get_db_connection():
        return sqlite3.connect(path_name)
    
    @staticmethod
    def create_table():
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            
            # יצירת הטבלה אם לא קיימת
            sql = '''create table if not exists users (
                user_id integer primary key autoincrement,
                first_name text not null,
                last_name text not null,
                user_email text not null,
                user_password text not null,
                role_id integer default 2,
                FOREIGN KEY (role_id) REFERENCES roles(role_id)
                )'''
            cursor.execute(sql)
            
            # בדיקה והוספת עמודת stars אם לא קיימת
            cursor.execute("PRAGMA table_info(users)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'stars' not in columns:
                cursor.execute('ALTER TABLE users ADD COLUMN stars integer DEFAULT 0')
                
            if 'profile_animal_id' not in columns:
                cursor.execute('ALTER TABLE users ADD COLUMN profile_animal_id integer DEFAULT null')
            
            connection.commit()
            cursor.close()

    @staticmethod
    def create_user(first_name, last_name, user_email, user_password):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "insert into users (first_name, last_name, user_email, user_password) values (?, ?, ?, ?)"
            cursor.execute(sql,(first_name, last_name, user_email, user_password))
            connection.commit()
            user_id = cursor.lastrowid
            cursor.close()
            return {
                "user_id":user_id,
                "first_name": first_name,
                "last_name": last_name,
                "user_email": user_email,
                "user_password": user_password,
                "stars": 0,
                "profile_animal_id": None,
                "role_id": 2
            }

    @staticmethod
    def get_all_users():
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''SELECT users.user_id, users.first_name, users.last_name, users.user_email, users.user_password, users.stars, users.profile_animal_id, roles.role_name
            FROM users
            INNER JOIN roles ON roles.role_id = users.role_id
            '''
            cursor.execute(sql)
            users = cursor.fetchall()
            if not users:
                cursor.close()
                return {"Massages":"No users has been added yet"}
            cursor.close()
            return [
                {
                    "user_id":row[0],
                    "first_name":row[1],
                    "last_name":row[2],
                    "user_email":row[3],
                    "user_password":row[4],
                    "stars":row[5],
                    "profile_animal_id":row[6],
                    "role_name":row[7]
                }
                for row in users
            ]
    

    @staticmethod
    def show_user_by_id(user_id):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            # Select explicit columns to avoid index drift when schema evolves
            sql = """
                select user_id, first_name, last_name, user_email, user_password,
                       role_id, stars, profile_animal_id
                from users where user_id = ?
            """
            cursor.execute(sql,(user_id ,))
            user = cursor.fetchone()
            if not user:
                cursor.close()
                return None
            cursor.close()
            return {
                    "user_id":user[0],
                    "first_name":user[1],
                    "last_name":user[2],
                    "user_email":user[3],
                    "user_password":user[4],
                    "role_id":user[5],
                    "stars":user[6],
                    "profile_animal_id":user[7]
                }
        
    @staticmethod
    def show_user_by_email_and_password(user_email, user_password):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            # Select explicit columns to avoid index drift when schema evolves
            sql = """
                select user_id, first_name, last_name, user_email, user_password,
                       role_id, stars, profile_animal_id
                from users where user_email = ? and user_password = ?
            """
            cursor.execute(sql,(user_email, user_password))
            user = cursor.fetchone()
            if not user:
                cursor.close()
                return None
            cursor.close()
            return {
                "user_id":user[0],
                "first_name":user[1],
                "last_name":user[2],
                "user_email":user[3],
                "user_password":user[4],
                "role_id":user[5],
                "stars":user[6],
                "profile_animal_id":user[7]
            }
        
    @staticmethod
    def update_user_by_id(user_id, data):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "select * from users where user_id =?"
            cursor.execute(sql,(user_id  ,))
            user = cursor.fetchone()
            if not user:
                cursor.close()
                return None
            
            pair = ""
            for key,value in data.items():
                pair += key + "=" + "'" + value + "'" + ","
            pair = pair [:-1]
            sql = f'''update users 
                    set {pair} where user_id = ?'''
            cursor.execute(sql,(user_id ,))
            connection.commit()
            cursor.close()
            return {"Message":f"user_id {user_id} has been updated successfully"}
    
    @staticmethod
    def delete_user_by_id(user_id):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "select * from users where user_id =?"
            cursor.execute(sql,(user_id ,))
            user = cursor.fetchone()
            if not user:
                cursor.close()
                return None
            sql = "delete from users where user_id = ?"
            cursor.execute(sql,(user_id,))
            connection.commit()
            cursor.close()
            return {"Message":"User deleted successfully"}

    @staticmethod
    def if_mail_exists(user_email):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "select user_email from users where user_email =?"
            cursor.execute(sql,(user_email ,))
            exists = cursor.fetchone()
            cursor.close()
            if not exists:
                return True
            return False

    @staticmethod
    def set_role_for_email(user_email, role_id):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "update users set role_id = ? where user_email = ?"
            cursor.execute(sql, (role_id, user_email))
            connection.commit()
            cursor.close()
            return {"Message": f"Role updated for {user_email} to {role_id}"}
    
    @staticmethod
    def add_stars(user_id, stars_to_add):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "update users set stars = stars + ? where user_id = ?"
            cursor.execute(sql, (stars_to_add, user_id))
            connection.commit()
            cursor.close()
            return {"Message": f"Added {stars_to_add} stars to user {user_id}"}
    
    @staticmethod
    def spend_stars(user_id, stars_to_spend):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            # בדיקה שיש מספיק כוכבים
            sql = "select stars from users where user_id = ?"
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            if not user or user[0] < stars_to_spend:
                cursor.close()
                return {"Error": "Not enough stars"}
            
            sql = "update users set stars = stars - ? where user_id = ?"
            cursor.execute(sql, (stars_to_spend, user_id))
            connection.commit()
            cursor.close()
            return {"Message": f"Spent {stars_to_spend} stars for user {user_id}"}

    @staticmethod
    def set_profile_animal(user_id, animal_id):
        with Users_Model.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "update users set profile_animal_id = ? where user_id = ?"
            cursor.execute(sql, (animal_id, user_id))
            connection.commit()
            cursor.close()
            return {"Message": f"Profile animal set to {animal_id} for user {user_id}"}