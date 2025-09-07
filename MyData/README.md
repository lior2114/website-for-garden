# Backend API -תוכנה לגן ילדים  (Flask)

שרת Flask עם מסד נתונים SQLite המשרת את האפליקציה "תוכנה לאמא". ה‑API מנהל משתמשים, תפקידים, חיות, כוכבים ורכישות בחנות.

## התקנה והפעלה

1. התקן את ה-dependencies:
```bash
pip install -r requirements.txt
```

2. הפעל את השרת (ודא שה‑venv פעיל אם קיים):
```bash
python app.py
```

השרת יפעל על `http://localhost:5000`

## API Endpoints

### משתמשים (Users)
- `POST /users` – הרשמת משתמש חדש
- `GET /users` – קבלת כל המשתמשים
- `GET /users/login` – התחברות (באמצעות query parameters)
- `GET /users/check_email` – בדיקת זמינות אימייל (query parameters)
- `GET /users/<user_id>` – קבלת משתמש לפי ID
- `PUT /users/<user_id>` – עדכון משתמש
- `DELETE /users/<user_id>` – מחיקת משתמש
- `POST /users/<user_id>/add_stars` – הוספת כוכבים למשתמש
- `POST /users/<user_id>/spend_stars` – הורדת כוכבים (רכישה)
- `POST /users/<user_id>/set_profile_animal` – הגדרת חיית פרופיל

### חיות (Animals)
- `GET /animals` – קבלת כל החיות הזמינות בחנות
- `GET /animals/<animal_id>` – קבלת פרטיי חיה
- `POST /users/<user_id>/purchase/<animal_id>` – רכישת חיה למשתמש
- `GET /users/<user_id>/animals` – קבלת כל החיות שנרכשו למשתמש

### תפקידים (Roles)
- `POST /roles` – יצירת תפקיד חדש
- `GET /roles` – קבלת כל התפקידים
- `GET /roles/<role_id>` – קבלת תפקיד לפי ID
- `PUT /roles/<role_id>` – עדכון תפקיד
- `DELETE /roles/<role_id>` – מחיקת תפקיד

## הערות
- כל הקצוות רשומים כ‑Blueprints תחת `routes/` ומממשים לוגיקה דרך ה‑Controllers בתיקייה `controller/`.
- מסד הנתונים נשמר תחת `SQL/Mydb.db`. 

## מבנה הפרויקט

- `app.py` – הקובץ הראשי והפעלת השרת
- `models/` – מודלים של בסיס הנתונים
- `controller/` – לוגיקה עסקית
- `routes/` – הגדרת REST endpoints
- `SQL/` – מסד נתונים SQLite וקבצים נלווים
