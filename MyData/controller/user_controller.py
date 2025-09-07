from flask import jsonify, request
from models.users_model import Users_Model as U
import re 

class Users_Controller:

    @staticmethod
    def create_user():
        data = request.get_json()
        lis_requimints = ["first_name", "last_name", "user_email", "user_password"]
        if not data or not all(k in data for k in lis_requimints):
            return jsonify ({"Error":"Missing values or data empty"}), 400
        if len(data["user_password"].strip()) < 4:
            return jsonify ({"Error":"password need to be more then 4 values"}), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", data["user_email"]): #תנאי בדיקת מיילים 
            return jsonify({"Error": "Invalid email format"}), 400
        if not U.if_mail_exists(data["user_email"]):
            return jsonify ({"Error":"Email already exists"}), 400
        result = U.create_user(
            first_name=data["first_name"],
            last_name=data["last_name"],
            user_email=data["user_email"],
            user_password=data["user_password"],
        )
        return jsonify(result) , 201

    @staticmethod
    def get_all_users(): 
        result = U.get_all_users()
        return jsonify(result), 200
    
    @staticmethod
    def show_user_by_id(user_id):
        result = U.show_user_by_id(user_id)
        if result is None:
            return jsonify({"Error": "User not found"}), 404
        return jsonify(result), 200
    
    @staticmethod
    def show_user_by_email_and_password():

        # Prefer query params for GET, then try JSON body silently
        data = request.args.to_dict()
        if not data:
            data = request.get_json(silent=True) or {}
        
        # Debug: print received data
        print(f"Received data: {data}")
        
        if not data:
            return jsonify ({"Error":"Missing values or data empty"}), 400
        if "user_email" not in data or "user_password" not in data:
            return jsonify ({"Error":"Missing email or password parameters"}), 400
        
        # Clean the data (strip whitespace)
        email = str(data["user_email"]).strip()
        password = str(data["user_password"]).strip()
        
        print(f"Cleaned email: '{email}', password: '{password}'")
        
        if not email or not password:
            return jsonify ({"Error":"Email and password cannot be empty"}), 400
            
        result = U.show_user_by_email_and_password(email, password)
        if result is None:
            return jsonify({"Error": "Invalid email or password"}), 401
        return jsonify(result), 200

    @staticmethod
    def update_user_by_id(user_id):
        data = request.get_json()
        allowed_keys = ["first_name", "last_name", "user_email", "user_password", "role_id"]
        if not data:
            return jsonify ({"Error":"Missing values or data empty"}), 400
        for value in data:
            if value not in allowed_keys:
                return jsonify ({"Error":f"invalid key: {value}"}), 400
        if "user_password" in data and len(str(data["user_password"]).strip()) < 4: #סטריפ מוריד רווחים 
            return jsonify ({"Error":"password need to be more then 4 values"}), 400
        if "user_email" in data:
            if not re.match(r"[^@]+@[^@]+\.[^@]+", str(data["user_email"])): #תנאי בדיקת מיילים
                return jsonify({"Error": "Invalid email format"}), 400
            if not U.if_mail_exists(data["user_email"]):
                return jsonify ({"Error":"Email already exists"}), 400
        if "first_name" in data and (not str(data["first_name"]).isalpha()):
            return jsonify({"Error": "first_name must contain only letters"}), 400
        if "last_name" in data and (not str(data["last_name"]).isalpha()):
            return jsonify({"Error": "last_name must contain only letters"}), 400
        if "role_id" in data:
            try:
                data["role_id"] = int(data["role_id"])  # normalize
            except Exception:
                return jsonify({"Error":"role_id must be integer"}), 400
            if data["role_id"] not in [1,2]:
                return jsonify({"Error":"role_id must be 1 (admin) or 2 (user)"}), 400
        if "user_email" in data:
            if U.if_mail_exists(data["user_email"])==False:
                return jsonify({"Error":"Mail already exists in the system"})
        result = U.update_user_by_id(user_id, data)
        if result is None:
            return jsonify({"Error": "user not found"}), 404
        return jsonify(result), 200
    
    @staticmethod
    def delete_user_by_id(user_id):
        result = U.delete_user_by_id(user_id)
        if result is None:
            return jsonify({"Error": "User not found"}), 404
        return jsonify(result), 200
    
    @staticmethod
    def check_if_email_exists():
        # Support both JSON body and query parameters
        if request.is_json:
            data = request.get_json()
        else:
            data = request.args.to_dict()
        
        if not data:
            return jsonify ({"Error":"Missing values or data empty"}), 400
        if not "user_email" in data:
            return jsonify ({"error":"wrong value"}), 400
        if U.if_mail_exists(data["user_email"]) == False:
            return jsonify({"Message":"email alredy exists in system"}), 200
        if U.if_mail_exists(data["user_email"]) == True:
            return jsonify({"Message":"email not exists"}), 200
    
    @staticmethod
    def add_stars(user_id):
        data = request.get_json()
        if not data or "stars" not in data:
            return jsonify({"Error": "Missing stars value"}), 400
        try:
            stars = int(data["stars"])
            if stars <= 0:
                return jsonify({"Error": "Stars must be positive"}), 400
        except ValueError:
            return jsonify({"Error": "Stars must be a number"}), 400
        
        result = U.add_stars(user_id, stars)
        return jsonify(result), 200
    
    @staticmethod
    def spend_stars(user_id):
        data = request.get_json()
        if not data or "stars" not in data:
            return jsonify({"Error": "Missing stars value"}), 400
        try:
            stars = int(data["stars"])
            if stars <= 0:
                return jsonify({"Error": "Stars must be positive"}), 400
        except ValueError:
            return jsonify({"Error": "Stars must be a number"}), 400
        
        result = U.spend_stars(user_id, stars)
        if "Error" in result:
            return jsonify(result), 400
        return jsonify(result), 200
    
    @staticmethod
    def set_profile_animal(user_id):
        data = request.get_json()
        if not data or "animal_id" not in data:
            return jsonify({"Error": "Missing animal_id value"}), 400
        try:
            animal_id = int(data["animal_id"]) if data["animal_id"] is not None else None
        except ValueError:
            return jsonify({"Error": "Animal ID must be a number"}), 400
        
        result = U.set_profile_animal(user_id, animal_id)
        return jsonify(result), 200
        
