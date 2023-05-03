# NBA stats

### Dataset

| Var                             | Type     | Description                                                                                                                       |
| ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| id                              | Integer  | Unique identifier for each event                                                                                                  |
| sequence_number                 | Integer  | The sequence number of the event within the game                                                                                  |
| type_id                         | Integer  | The unique identifier for the event type                                                                                          |
| type_text                       | String   | The name of the event type                                                                                                        |
| text                            | String   | Textual description of the event                                                                                                  |
| away_score                      | Integer  | The score of the away team at the time of the event                                                                               |
| home_score                      | Integer  | The score of the home team at the time of the event                                                                               |
| period_number                   | Integer  | The period number in which the event occurred                                                                                     |
| period_display_value            | String   | The period name in which the event occurred                                                                                       |
| clock_display_value             | String   | The time remaining in the period when the event occurred                                                                          |
| scoring_play                    | Boolean  | Whether or not the event resulted in a score                                                                                      |
| score_value                     | Integer  | The value of the score resulting from the event                                                                                   |
| team_id                         | Integer  | The unique identifier for the team that performed the event                                                                       |
| athlete_id_1                    | Integer  | The unique identifier for the primary athlete involved in the event                                                               |
| athlete_id_2                    | Integer  | The unique identifier for the secondary athlete involved in the event                                                             |
| athlete_id_3                    | Integer  | The unique identifier for the tertiary athlete involved in the event                                                              |
| wallclock                       | Datetime | The timestamp when the event occurred in ISO 8601 format                                                                          |
| shooting_play                   | Boolean  | Whether or not the event was a shooting event                                                                                     |
| coordinate_x_raw                | Integer  | The x-coordinate of the location on the court where the event occurred                                                            |
| coordinate_y_raw                | Integer  | The y-coordinate of the location on the court where the event occurred                                                            |
| season                          | Integer  | The year of the season in which the event occurred                                                                                |
| season_type                     | Integer  | The type of the season (1 for preseason, 2 for regular season, 3 for postseason)                                                  |
| away_team_id                    | Integer  | The unique identifier for the away team                                                                                           |
| away_team_name                  | String   | The name of the away team                                                                                                         |
| away_team_mascot                | String   | The mascot of the away team                                                                                                       |
| away_team_abbrev                | String   | The abbreviation for the away team name                                                                                           |
| away_team_name_alt              | String   | The alternative name of the visiting team.                                                                                        |
| home_team_id                    | Integer  | The unique identifier of the home team.                                                                                           |
| home_team_name                  | String   | The name of the home team.                                                                                                        |
| home_team_mascot                | String   | The mascot of the home team.                                                                                                      |
| home_team_abbrev                | String   | The abbreviation of the home team's name.                                                                                         |
| home_team_name_alt              | String   | The alternative name of the home team.                                                                                            |
| home_team_spread                | Integer  | The spread for the home team. It represents how many points the home team is expected to win by.                                  |
| game_spread                     | Integer  | The spread for the game. It represents how many points the away team is expected to lose by.                                      |
| home_favorite                   | Boolean  | A Boolean that indicates whether the home team is the favorite team to win.                                                       |
| game_spread_available           | Boolean  | A Boolean that indicates whether the game spread is available.                                                                    |
| game_id                         | Integer  | The unique identifier for the game.                                                                                               |
| qtr                             | Integer  | The quarter of the game.                                                                                                          |
| time                            | String   | The time remaining in the current quarter in minutes and seconds.                                                                 |
| clock_minutes                   | Integer  | The time remaining in the current quarter in minutes.                                                                             |
| clock_seconds                   | Integer  | The time remaining in the current quarter in seconds.                                                                             |
| half                            | Integer  | The half of the game.                                                                                                             |
| game_half                       | Integer  | The half of the game, represented as a string of digits, starting at 1 for the first half of the game.                            |
| lead_qtr                        | Integer  | The quarter number of the game where the team was leading at the start of the possession.                                         |
| lead_game_half                  | Integer  | The half of the game where the team was leading at the start of the possession.                                                   |
| start_quarter_seconds_remaining | Integer  | The number of seconds remaining in the quarter when the possession started.                                                       |
| start_half_seconds_remaining    | Integer  | The number of seconds remaining in the half when the possession started.                                                          |
| start_game_seconds_remaining    | Integer  | The number of seconds remaining in the game when the possession started.                                                          |
| game_play_number                | Integer  | The play number of the game, where a play is defined as an exchange of possessions between teams resulting in a stoppage of play. |
| end_quarter_seconds_remaining   | Integer  | The number of seconds remaining in the quarter when the possession ended.                                                         |
| end_half_seconds_remaining      | Integer  | The number of seconds remaining in the half when the possession ended.                                                            |
| end_game_seconds_remaining      | Integer  | The number of seconds remaining in the game when the possession ended.                                                            |
| period                          | Integer  | The period of the game where the possession occurred.                                                                             |
| lag_qtr                         | Integer  | The quarter number of the game where the team was leading at the end of the previous possession.                                  |
| lag_game_half                   | Integer  | The half of the game where the team was leading at the end of the previous possession.                                            |
| coordinate_x                    | Integer  | The x-coordinate of the location on the court where the possession ended, measured in inches from the left baseline               |
| coordinate_y                    | Integer  | The y-coordinate of the location on the court where the possession ended, measured in inches from the bottom baseline             |
| game_date                       | Date     | The date of the game.                                                                                                             |
| game_date_time                  | Datetime | The date and time of the game.                                                                                                    |
| type_abbreviation               | String   | The abbreviation of the game type (e.g. "REG" for regular season, "POST" for playoffs, etc.).                                     |
