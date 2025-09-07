from flask import Flask, Blueprint
from controller.animals_controller import Animals_Controller as A

animals_bp = Blueprint("/animals", __name__)

@animals_bp.route("/animals", methods = ["GET"])
def get_all_animals():
    return A.get_all_animals()

@animals_bp.route("/animals/<int:animal_id>", methods = ["GET"])
def get_animal_by_id(animal_id):
    return A.get_animal_by_id(animal_id)

@animals_bp.route("/users/<int:user_id>/purchase/<int:animal_id>", methods = ["POST"])
def purchase_animal(user_id, animal_id):
    return A.purchase_animal(user_id, animal_id)

@animals_bp.route("/users/<int:user_id>/animals", methods = ["GET"])
def get_user_animals(user_id):
    return A.get_user_animals(user_id)
