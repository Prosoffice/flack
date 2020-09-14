# FLACK 
## Web Programming with Python and JavaScript
This is a multi-room chat Web app using Flask-SocketIO.

Installation
Run the below command to install all packages:

```pip3 install -r requirements.txt```

You need to tell Flask which file will run the application. If you are using Linux:

```export FLASK_APP=application.py```


Running
Please run application.py by using python3 application.py instead of flask run. Running flask run will get a ValueError: signal only works in main thread as by Flask-SocketIO issue.


Compatibility
Please use an updated Firefox or Chrome browser for best results.
