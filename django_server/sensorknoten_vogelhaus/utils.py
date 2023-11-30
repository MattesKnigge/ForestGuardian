from datetime import datetime


def get_current_season(north_hemisphere: bool = True) -> str:
    dt = (datetime.now().month, datetime.now().day)
    if (3, 21) <= dt < (6, 21):
        season = 'spring' if north_hemisphere else 'fall'
    elif (6, 21) <= dt < (9, 21):
        season = 'summer' if north_hemisphere else 'winter'
    elif (9, 21) <= dt < (12, 21):
        season = 'fall' if north_hemisphere else 'spring'
    else:
        season = 'winter' if north_hemisphere else 'summer'

    return season
