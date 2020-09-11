from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired


class LoginForm(FlaskForm):
    display_name = IntegerField("Display name", validators=[InputRequired()], render_kw={'placeholder': 'Frank Lewis', 'class':'input100'})


class ChannelForm(FlaskForm):
    channel_name = StringField("Channel Name", validators=[InputRequired()], render_kw={'id': 'name'})


class ChatForm(FlaskForm):
    chat = StringField("", validators=[InputRequired()], render_kw={'id': 'chat', 'placeholder': 'Hello'})