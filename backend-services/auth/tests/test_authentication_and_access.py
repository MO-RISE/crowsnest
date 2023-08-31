import requests
from urllib.parse import quote_plus as parse

# import json
# from backend.models import User, users


def test_redirect(compose):

    # The client is redirected when requesting a protected resource without providing a bearer token through a
    # cookie or header ...
    response = requests.get(compose["admin"])
    assert response.status_code == 200
    assert response.history[0].status_code == 307

    # ... or when providing an invalid bearer token in a cookie ....
    response = requests.get(
        compose["admin"], cookies={"crowsnest-auth-access": "bad_token"}
    )
    assert response.status_code == 200
    assert response.history[0].status_code == 307

    # ... or in a Authorization header
    response = requests.get(
        compose["admin"], headers={"Authorization": "Bearer bad_token"}
    )
    assert response.status_code == 200
    assert response.history[0].status_code == 307


def test_api_login(compose):

    # A login request with non-existing username ...
    response = requests.post(
        compose["auth"] + "/api/login", {"username": "foo", "password": "foo"}
    )

    # ... returns a status code HTTPError:401 Unauthorized
    assert response.status_code == 401

    # A login request with wrong password ...
    response = requests.post(
        compose["auth"] + "/api/login", {"username": "admin", "password": "foo"}
    )

    # ... returns a status code HTTPError:401 Unauthorized
    assert response.status_code == 401

    # A login request with the right credentials ...
    response = requests.post(
        compose["auth"] + "/api/login", {"username": "admin", "password": "password"}
    )

    # ... returns a status code 200:OK ...
    assert response.status_code == 200

    # ... and returns a cookie containing the bearer token
    cookies = response.cookies
    assert "crowsnest-auth-access" in cookies.get_dict()

    # Protected resources are accessible by with the cookie ...
    response = requests.get(compose["admin"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) == 0

    # ... or by providing the bearer token in the request headers
    response = requests.get(
        compose["admin"],
        headers={
            "Authorization": f"Bearer {cookies.get_dict()['crowsnest-auth-access']}",
        },
    )
    assert response.status_code == 200
    assert len(response.history) == 0


def test_api_verify(compose, make_dummy_user, set_dummy_user_fields):

    # Log in as 'dummy_user'
    response = requests.post(
        compose["auth"] + "/api/login",
        {"username": "dummy_user", "password": "password"},
    )
    assert response.status_code == 200
    cookies = response.cookies

    # Dummy can access 'white' and 'black'
    response = requests.get(compose["white"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) == 0
    response = requests.get(compose["black"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) == 0

    # Add 'white' to path whitelist to 'dummy_user' ...
    set_dummy_user_fields(path_whitelist="/white", path_blacklist=None)

    # ... and 'dummy_user' can access 'white' but not 'black'
    response = requests.get(compose["white"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) == 0
    response = requests.get(compose["black"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) != 0
    assert response.history[0].status_code == 307

    # Add 'white' to path blacklist to 'dummy_user' ...
    set_dummy_user_fields(path_blacklist="/white", path_whitelist=None)

    # ... and 'dummy_user' can access 'black' but not 'white'
    response = requests.get(compose["black"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) == 0
    response = requests.get(compose["white"], cookies=cookies)
    assert response.status_code == 200
    assert len(response.history) != 0
    assert response.history[0].status_code == 307

    # Dummy user has 'admin' set to false, so it cannot access protected
    # resources with 'admin' in the uri
    response = requests.get(compose["admin"], cookies=cookies)
    assert response.status_code == 200
    assert response.history[0].status_code == 307


def test_verify_emqx(compose, make_dummy_user, set_dummy_user_fields):

    # Add 'foo' to topic whitelist to 'dummy_user' ...
    set_dummy_user_fields(topic_whitelist="/foo")

    response = requests.get(
        compose["auth"] + "/api/verify_emqx?username=dummy_user&topic=" + parse("/foo")
    )
    assert response.status_code == 200

    response = requests.get(
        compose["auth"] + "/api/verify_emqx?username=dummy_user&topic=" + parse("/bar")
    )
    assert response.status_code != 200

    # Add 'bar' to topic whitelist to 'dummy_user' ...
    set_dummy_user_fields(topic_whitelist="", topic_blacklist="/bar")

    response = requests.get(
        compose["auth"] + "/api/verify_emqx?username=dummy_user&topic=" + parse("/foo")
    )
    assert response.status_code == 200

    response = requests.get(
        compose["auth"] + "/api/verify_emqx?username=dummy_user&topic=" + parse("/bar")
    )
    assert response.status_code != 200


"""


def test_verify_emqx(compose):
    with TestClient(app) as tc:

        response = tc.get(
            "/verify_emqx",
            params={
                "username": "admin",
                "topic": "any/trial/topic",
            },
        )
        assert response.status_code == 200


def test_verify_emqx_topic_whitelist(compose, set_admin_user_fields):
    set_admin_user_fields(topic_whitelist=["any/+/topic/#"])
    with TestClient(app) as tc:

        response = tc.get(
            "/verify_emqx",
            params={"username": "admin", "topic": "any/trial/topic"},
        )
        assert response.status_code == 200, response.text

        response = tc.get(
            "/verify_emqx",
            params={"username": "admin", "topic": "any/trial/"},
        )
        assert response.status_code == 403, response.text


def test_verify_emqx_topic_blacklist(compose, set_admin_user_fields):
    set_admin_user_fields(topic_blacklist=["any/+/topic/#"])
    with TestClient(app) as tc:

        response = tc.get(
            "/verify_emqx",
            params={"username": "admin", "topic": "something/else/trial/topic"},
        )
        assert response.status_code == 200, response.text

        response = tc.get(
            "/verify_emqx",
            params={"username": "admin", "topic": "any/trial/topic/"},
        )
        assert response.status_code == 403, response.text

"""
