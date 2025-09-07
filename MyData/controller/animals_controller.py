from flask import jsonify, request
from models.animals_model import Animals_Model as A
from models.user_animals_model import User_Animals_Model as UA
from models.users_model import Users_Model as U

class Animals_Controller:

    @staticmethod
    def get_all_animals():
        result = A.get_all_animals()
        return jsonify(result), 200

    @staticmethod
    def get_animal_by_id(animal_id):
        result = A.get_animal_by_id(animal_id)
        if result is None:
            return jsonify({"Error": "Animal not found"}), 404
        return jsonify(result), 200

    @staticmethod
    def purchase_animal(user_id, animal_id):
        # בדוק שהחיה קיימת
        animal = A.get_animal_by_id(animal_id)
        if animal is None:
            return jsonify({"Error": "Animal not found"}), 404
            
        # בדוק שהמשתמש קיים
        user = U.show_user_by_id(user_id)
        if user is None:
            return jsonify({"Error": "User not found"}), 404
            
        # בדוק שיש מספיק כוכבים
        # שלוף כוכבים עדכניים מה-DB כדי למנוע שוני בין צד לקוח לשרת
        db_user = U.show_user_by_id(user_id)
        if db_user is None:
            return jsonify({"Error": "User not found"}), 404
        if int(db_user.get("stars", 0)) < int(animal["price"]):
            return jsonify({"Error": "Not enough stars"}), 400
            
        # נסה לקנות את החיה
        purchase_result = UA.purchase_animal(user_id, animal_id)
        if "Error" in purchase_result:
            return jsonify(purchase_result), 400
            
        # הוצא כוכבים מהמשתמש
        spend_result = U.spend_stars(user_id, animal["price"])
        if "Error" in spend_result:
            return jsonify(spend_result), 400
            
        return jsonify({
            "Message": f"Successfully purchased {animal['name']} for {animal['price']} stars",
            "animal": animal,
            "remaining_stars": int(db_user.get("stars", 0)) - int(animal["price"])
        }), 200

    @staticmethod
    def get_user_animals(user_id):
        # בדוק שהמשתמש קיים
        user = U.show_user_by_id(user_id)
        if user is None:
            return jsonify({"Error": "User not found"}), 404
            
        result = UA.get_user_animals(user_id)
        return jsonify(result), 200
