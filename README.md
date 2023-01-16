# Money-Tracker
Web Application to track expense and split bills within your friends based on React frontend and django backend

### Functionalities added
* Login and Register
* Add new Friend
* Create new Transactions
* Update Transaction
* Delete Transaction
* Split and pay for the money owed
* Search through and filter transactions

### Install the application
1. Installing the react frontend
The frontend server runs at 'http://localhost:3000/'
```
git clone https://github.com/KrutikaBhatt/Money-Tracker
cd Money-Tracker
npm i
npm start
```
2. Installing the django backend
The backend server runs at 'http://127.0.0.1:8000/'
```
python3 -m venv venv
source venv/bin/activate

cd backend
pip install -r requirements.txt
```

Connect database, make migration and run the backend server
```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Working
https://user-images.githubusercontent.com/65107474/212606480-44b9eb0e-1b64-4e13-87e5-caec277eec1d.mp4

