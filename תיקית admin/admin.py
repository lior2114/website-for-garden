import os
import re
import sqlite3
import tkinter as tk
from tkinter import messagebox


def get_db_path() -> str:
    # admin.py is in '<project_root>/תיקית admin/'. Go one level up to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_dir = os.path.join(project_root, 'MyData', 'SQL')
    db_path = os.path.join(db_dir, 'Mydb.db')
    # Ensure directory exists (safe if already exists)
    os.makedirs(db_dir, exist_ok=True)
    return db_path


def ensure_users_table(connection: sqlite3.Connection) -> None:
    cursor = connection.cursor()
    # Create table if not exists (align with backend schema)
    cursor.execute(
        '''create table if not exists users (
            user_id integer primary key autoincrement,
            first_name text not null,
            last_name text not null,
            user_email text not null,
            user_password text not null,
            role_id integer default 2,
            FOREIGN KEY (role_id) REFERENCES roles(role_id)
        )'''
    )

    # Ensure columns 'stars' and 'profile_animal_id' exist
    cursor.execute('PRAGMA table_info(users)')
    columns = [row[1] for row in cursor.fetchall()]
    if 'stars' not in columns:
        cursor.execute('ALTER TABLE users ADD COLUMN stars integer DEFAULT 0')
    if 'profile_animal_id' not in columns:
        cursor.execute('ALTER TABLE users ADD COLUMN profile_animal_id integer DEFAULT null')
    connection.commit()
    cursor.close()


class AdminApp:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title('Admin - Users & Stars')

        # DB connection (create if missing)
        self.db_path = get_db_path()
        with sqlite3.connect(self.db_path) as conn:
            ensure_users_table(conn)

        # Build UI
        self._build_create_user_frame()
        self._build_stars_frame()

    # UI Builders
    def _build_create_user_frame(self) -> None:
        frame = tk.LabelFrame(self.root, text='Create User', padx=10, pady=10)
        frame.grid(row=0, column=0, padx=10, pady=10, sticky='nsew')

        tk.Label(frame, text='First Name:').grid(row=0, column=0, sticky='e')
        self.first_name_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.first_name_var, width=28).grid(row=0, column=1)

        tk.Label(frame, text='Last Name:').grid(row=1, column=0, sticky='e')
        self.last_name_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.last_name_var, width=28).grid(row=1, column=1)

        tk.Label(frame, text='Email:').grid(row=2, column=0, sticky='e')
        self.email_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.email_var, width=28).grid(row=2, column=1)

        tk.Label(frame, text='Password:').grid(row=3, column=0, sticky='e')
        self.password_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.password_var, show='*', width=28).grid(row=3, column=1)

        tk.Button(frame, text='Create User', command=self.create_user, width=20).grid(row=4, column=0, columnspan=2, pady=(8, 0))

    def _build_stars_frame(self) -> None:
        frame = tk.LabelFrame(self.root, text='Stars by Email', padx=10, pady=10)
        frame.grid(row=1, column=0, padx=10, pady=10, sticky='nsew')

        tk.Label(frame, text='Email:').grid(row=0, column=0, sticky='e')
        self.stars_email_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.stars_email_var, width=28).grid(row=0, column=1)

        tk.Label(frame, text='Stars:').grid(row=1, column=0, sticky='e')
        self.stars_value_var = tk.StringVar()
        tk.Entry(frame, textvariable=self.stars_value_var, width=28).grid(row=1, column=1)

        buttons = tk.Frame(frame)
        buttons.grid(row=2, column=0, columnspan=2, pady=(8, 0))
        tk.Button(buttons, text='Set Exact Stars', command=self.set_stars_by_email, width=16).grid(row=0, column=0, padx=4)
        tk.Button(buttons, text='Add Stars (+)', command=self.add_stars_by_email, width=16).grid(row=0, column=1, padx=4)

        # Show current stars helper
        tk.Button(frame, text='Check Current Stars', command=self.check_current_stars, width=20).grid(row=3, column=0, columnspan=2, pady=(8, 0))

    # Actions
    def create_user(self) -> None:
        first_name = self.first_name_var.get().strip()
        last_name = self.last_name_var.get().strip()
        email = self.email_var.get().strip()
        password = self.password_var.get().strip()

        if not first_name or not last_name or not email or not password:
            messagebox.showerror('Error', 'All fields are required')
            return
        if len(password) < 4:
            messagebox.showerror('Error', 'Password must be at least 4 characters')
            return
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            messagebox.showerror('Error', 'Invalid email format')
            return

        try:
            with sqlite3.connect(self.db_path) as conn:
                ensure_users_table(conn)
                cursor = conn.cursor()
                # Check if email exists
                cursor.execute('select 1 from users where user_email = ?', (email,))
                if cursor.fetchone():
                    messagebox.showerror('Error', 'Email already exists')
                    return

                cursor.execute(
                    'insert into users (first_name, last_name, user_email, user_password) values (?, ?, ?, ?)',
                    (first_name, last_name, email, password)
                )
                conn.commit()
                messagebox.showinfo('Success', f'User created (ID: {cursor.lastrowid})')
                # Clear inputs
                self.first_name_var.set('')
                self.last_name_var.set('')
                self.email_var.set('')
                self.password_var.set('')
        except Exception as e:
            messagebox.showerror('Error', f'Failed to create user: {e}')

    def _parse_stars_input(self) -> int | None:
        value = self.stars_value_var.get().strip()
        if not value:
            messagebox.showerror('Error', 'Stars value is required')
            return None
        try:
            stars = int(value)
            return stars
        except ValueError:
            messagebox.showerror('Error', 'Stars must be a number')
            return None

    def set_stars_by_email(self) -> None:
        email = self.stars_email_var.get().strip()
        stars = self._parse_stars_input()
        if stars is None:
            return
        if stars < 0:
            messagebox.showerror('Error', 'Stars cannot be negative')
            return
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            messagebox.showerror('Error', 'Invalid email format')
            return

        try:
            with sqlite3.connect(self.db_path) as conn:
                ensure_users_table(conn)
                cursor = conn.cursor()
                cursor.execute('update users set stars = ? where user_email = ?', (stars, email))
                if cursor.rowcount == 0:
                    messagebox.showerror('Error', 'Email not found')
                    return
                conn.commit()
                messagebox.showinfo('Success', f'Stars set to {stars} for {email}')
        except Exception as e:
            messagebox.showerror('Error', f'Failed to set stars: {e}')

    def add_stars_by_email(self) -> None:
        email = self.stars_email_var.get().strip()
        stars = self._parse_stars_input()
        if stars is None:
            return
        if stars <= 0:
            messagebox.showerror('Error', 'Stars to add must be positive')
            return
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            messagebox.showerror('Error', 'Invalid email format')
            return

        try:
            with sqlite3.connect(self.db_path) as conn:
                ensure_users_table(conn)
                cursor = conn.cursor()
                cursor.execute('update users set stars = coalesce(stars, 0) + ? where user_email = ?', (stars, email))
                if cursor.rowcount == 0:
                    messagebox.showerror('Error', 'Email not found')
                    return
                conn.commit()
                messagebox.showinfo('Success', f'Added {stars} stars to {email}')
        except Exception as e:
            messagebox.showerror('Error', f'Failed to add stars: {e}')

    def check_current_stars(self) -> None:
        email = self.stars_email_var.get().strip()
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            messagebox.showerror('Error', 'Invalid email format')
            return
        try:
            with sqlite3.connect(self.db_path) as conn:
                ensure_users_table(conn)
                cursor = conn.cursor()
                cursor.execute('select stars from users where user_email = ?', (email,))
                row = cursor.fetchone()
                if not row:
                    messagebox.showerror('Error', 'Email not found')
                    return
                current = row[0] if row[0] is not None else 0
                messagebox.showinfo('Current Stars', f'{email} has {current} stars')
        except Exception as e:
            messagebox.showerror('Error', f'Failed to check stars: {e}')


if __name__ == '__main__':
    root = tk.Tk()
    app = AdminApp(root)
    root.resizable(False, False)
    root.mainloop()


