from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, unique=True, index=True, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)
