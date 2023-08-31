"""Utilities"""
from itertools import zip_longest

SEPARATOR = "/"
SINGLE = "+"
ALL = "#"


def mqtt_match(pattern: str, topic: str) -> bool:
    """Evaluate if a topic matches a pattern

    Args:
        pattern (str): The pattern to match against
        topic (str): The topic to be matched

    Returns:
        bool: Match or no match
    """
    pattern_levels = pattern.split(SEPARATOR)
    topic_levels = topic.split(SEPARATOR)
    last_index = len(pattern_levels) - 1

    for index, (current_pattern, current_topic) in enumerate(
        zip_longest(pattern_levels, topic_levels)
    ):
        # Only allow '#' wildcard at the end
        if current_pattern == ALL:
            return index == last_index

        # Pattern and topic should be equal unless pattern is a '+' wildcard
        if current_pattern not in (SINGLE, current_topic):
            return False

    # If we get to here, we have no earlier mismatches
    return len(pattern_levels) == len(topic_levels)
