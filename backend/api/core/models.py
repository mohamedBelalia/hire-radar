from sqlalchemy import Column, DateTime, Enum, Integer, String, Text

from core import database as db


class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text)
    role = Column(Enum("employer", "candidate"))
    created_at = Column(DateTime, server_default=db.text("CURRENT_TIMESTAMP"))

    def __repr__(self):
        return f"<Name : {self.first_name}>"
