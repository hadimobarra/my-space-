# Local test instance only. Published on 127.0.0.1, with throwaway credentials.
import os

SECRET_KEY = os.environ["SUPERSET_SECRET_KEY"]
SQLALCHEMY_DATABASE_URI = "sqlite:////app/superset_home/superset.db"
PREVENT_UNSAFE_DB_CONNECTIONS = False  # lets the test dataset live in SQLite
TALISMAN_ENABLED = False
WTF_CSRF_ENABLED = False
LANGUAGES = {
    "en": {"flag": "us", "name": "English"},
    "fa": {"flag": "ir", "name": "Persian"},
}
