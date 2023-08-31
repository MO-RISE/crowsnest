from backend.utils import mqtt_match


def test_mqtt_topic_match():
    # No wildcards
    assert mqtt_match("foo/bar/baz", "foo/bar/baz")
    assert not mqtt_match("foo/bar/baz", "baz/bar/foo")

    # With leading slash
    assert mqtt_match("/foo/bar", "/foo/bar")
    assert not mqtt_match("/foo/bar", "/bar/foo")

    # With leading and trailing slash
    assert mqtt_match("/foo/bar/", "/foo/bar/")
    assert not mqtt_match("/foo/bar/", "/bar/foo/")

    # Wildcard ALL
    assert mqtt_match("#", "foo/bar/baz")
    assert mqtt_match("foo/#", "foo/bar/baz")
    assert mqtt_match("foo/bar/#", "foo/bar")  # Should match the parent level
    assert not mqtt_match("foo/bar/#", "foo")  # Should not match two levels above
    assert not mqtt_match("#/bar/baz", "foo/bar/baz")

    # Wildcard SINGLE
    assert mqtt_match("+/bar/baz", "foo/bar/baz")
    assert mqtt_match("foo/bar/+", "foo/bar/baz")
    assert not mqtt_match("foo/bar/+", "foo/bar/baz/")

    # Wildcard ALL and SINGLE
    assert mqtt_match("foo/+/baz", "foo/bar/baz")
    assert mqtt_match("foo/+/#", "foo/bar/baz")
