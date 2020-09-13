import os
from datetime import datetime
from flask import Flask, render_template, redirect, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_bootstrap import Bootstrap

from collections import deque

from form import *
from helpers import login_required


app = Flask(__name__)
socketio = SocketIO(app)
Bootstrap(app)


USERS = []
CHANNELS = {'general':{'link':'/channel/general', 'owner': 'default', 'chats':  [ {'name': 'Frank', 'chat': "I love you so much, Hi! this is message, i cant stop thinking about you, you make me laugh", 'time': '10pm'}]}}

SECRET_KEY = '83iarC2VG3MEjAKifififW'
app.config['SECRET_KEY'] = SECRET_KEY


# Make sessions permanent
@app.before_request
def before_request():
    session.permanent = True
    # Force https (src: https://stackoverflow.com/questions/32237379/python-flask-redirect-to-https-from-http)
    if request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)




@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    print("Login page-User has just been redirected here to the login page")
    form = ChannelForm()
    print("The user`s name as session tells me is ", session.get('user'))
    user = session.get('user')
    isChannel = False
    return render_template('index.html', form=form, user=user, channel=CHANNELS, isChannel=isChannel)


@socketio.on("channel creation")
def new_channel(data):
    new_channel = data['channel']
    channel_name = new_channel['name']
    print("A new channel was sent from client, the name of the channel is ", channel_name)
    if channel_name not in CHANNELS:
        channel_link = new_channel['link']
        channel_owner = new_channel['owner']
        CHANNELS[channel_name] = {'link': channel_link, 'owner': channel_owner, 'chats':[]}
        print("This new channel have just been appended to the CHANNEL mega list as one of the channals created here on the server")
        print("Sending back the channel to the client to update without refresh")
        emit('channel created and added', CHANNELS, broadcast=True)
    elif channel_name in CHANNELS:
        emit('channel created and added', "duplicate", broadcast=True)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    display_name = form.display_name.data
    if request.method == 'POST':
        print('valid')
        if display_name not in USERS:
            session['user'] = display_name
            print("User attach to session")
            USERS.append(display_name)
            print("User appended to users list")
            print("Users list now ", USERS)
            print("Redirecting user to login page now.....")
            return redirect('/')
        else:
            print('User has been here before')
            session['user'] = display_name
            return redirect('/')
    return render_template("login.html", form=form)




@app.route('/channel/<name>', methods=['GET', 'POST'])
@login_required
def channel(name):
    print("Channel page- user is here in the channel page by name ", name)
    if name in CHANNELS.keys():
        print(name, "is in the mega channels list")
    form = ChannelForm()
    user = session.get('user')
    isChannel = True
    return render_template('test.html', CHANNELS=CHANNELS.get(name), channel=CHANNELS, c=name, user=user, form=form, isChannel=isChannel)


@socketio.on('new message')
def new_message(data):
    print("A new message data was just sent from the client to a channel named", data['channel'])
    if data['channel'] in CHANNELS:
        print("Approved, the channel is present here in the server")
    time = datetime.now().strftime("%-I:%M")
    channel_name = data['channel']
    chat = data['chat']
    user = data['user']
    CHANNELS[channel_name]['chats'].append({'name':user, 'chat': chat, 'time': time})
    data = {'name':user, 'chat': chat, 'time': time, 'room': channel_name}
    emit('message stored', data, room=channel_name)




# Announce when a user just joins a channel
@socketio.on('join')
def on_join(data):
    channel = data['channel']
    join_room(channel)
    # Send a message to client side that this very user joined this channel
    data['time'] = datetime.now().strftime("%-I:%M")
    data['message'] = ': joined this room' # The colon there serves as a placeholder for the users display name.
    emit('join room', data, room = channel, broadcast=True)


# Anounce when a user leaves a chatroom
@socketio.on('leave')
def on_leave(data):
    room = data['room']   
    data['message'] = ': has left the room' 
    emit('leave room', data, room=room, broadcast=True)
    leave_room(room)




@app.route("/logout", methods=["GET"])
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")


