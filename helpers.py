from flask import session, redirect
from functools import wraps 

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("A user wants to access a secured page")
        if session.get('user') is None:
            print("The user has no session username, i am taking him back to the login page now...")
            return redirect('/login')
        print("Access granted! The user has a display name. Taking user to secured page...")
        return f(*args, **kwargs)

    return decorated_function
