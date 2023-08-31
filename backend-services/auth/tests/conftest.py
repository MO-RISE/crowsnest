from pathlib import Path

import pytest
import requests
import psycopg2
from sqlalchemy import create_engine
from backend.models import User, users
from passlib.context import CryptContext

import logging


# See https://github.com/avast/pytest-docker
@pytest.fixture(scope="session")
def docker_compose_file(pytestconfig):
    return Path(pytestconfig.rootdir) / "docker-compose.test.yml"


def postgres_is_responsive(uri):
    try:
        conn = psycopg2.connect(uri)
        return True
    except Exception:
        return False


def is_responsive(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
    except ConnectionError:
        return False


@pytest.fixture(scope="session")
def compose(docker_ip, docker_services):
    """Ensure that the services are up and responsive."""
    uris = {
        "postgres": f"postgresql://admin:password@{docker_ip}:{docker_services.port_for('database',5432)}/users",
        "auth": f"http://{docker_ip}/auth",
        "admin": f"http://{docker_ip}/admin",
        "black": f"http://{docker_ip}/black",
        "white": f"http://{docker_ip}/white",
    }
    docker_services.wait_until_responsive(
        timeout=10.0,
        pause=0.1,
        check=lambda: is_responsive(uris["auth"] + "/api/status"),
    )

    try:
        docker_services.wait_until_responsive(
            timeout=5.0, pause=0.2, check=lambda: is_responsive(uris["admin"])
        )
    except Exception as ex:
        logging.error(ex)

    return uris


@pytest.fixture
def pgdb_connection(compose):
    engine = create_engine(compose["postgres"])
    with engine.connect() as con:
        yield con


@pytest.fixture
def set_dummy_user_fields(pgdb_connection):
    restore = {}

    def _(**field_names_values):
        nonlocal restore
        restore = dict.fromkeys(field_names_values, None)
        query = (
            users.update()
            .where(User.username == "dummy_user")
            .values(**field_names_values)
        )
        pgdb_connection.execute(query)

    yield _

    restore_query = (
        users.update().where(User.username == "dummy_user").values(**restore)
    )
    pgdb_connection.execute(restore_query)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@pytest.fixture
def make_dummy_user(pgdb_connection):
    query = users.select().where(User.username == "dummy_user")
    dummy_user = pgdb_connection.execute(query).fetchone()
    if not dummy_user:
        hashed_password = pwd_context.hash("password")
        query = users.insert().values(
            username="dummy_user",
            firstname="Dummy",
            lastname="User",
            email="Dummy@Dumtown.com",
            admin=False,
            hashed_password=hashed_password,
        )
        pgdb_connection.execute(query)
