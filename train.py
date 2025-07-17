from src.tokenizer import Tokenizer

data = r"""
2026 FIFA World Cup qualification (CONCACAF)

Article
Talk
Read
Edit
View history

Tools
Appearance hide
Text

Small

Standard

Large
Width

Standard

Wide
Color (beta)

Automatic

Light

Dark
From Wikipedia, the free encyclopedia
2026 FIFA World Cup qualification (CONCACAF)

Tournament details
Dates	22 March 2024 – November 2025
Teams	32 (from 1 confederation)
Tournament statistics
Matches played	63
Goals scored	220 (3.49 per match)
Attendance	287,277 (4,560 per match)
Top scorer(s)	Curaçao Gervane Kastaneer
Saint Vincent and the Grenadines Oalex Anderson
(5 goals)
← 20222030 →
All statistics correct as of 10 June 2025.
CONCACAF Qualifiers
FIFA World Cup
CCCF–NAFC era
1950195419581962
CONCACAF era

1966197019741978198219861990199419982002200620102014201820222026
vte
The North, Central American and Caribbean section of the 2026 FIFA World Cup qualification will act as the qualifiers for the 2026 FIFA World Cup, to be held in Canada, Mexico, and the United States, for national teams which are members of the Confederation of North, Central American and Caribbean Association Football (CONCACAF). Three direct slots and two inter-confederation play-off slots in the final tournament were available for CONCACAF teams.

Format
On 9 May 2017, the FIFA Council approved the slot allocation for the 2026 FIFA World Cup, which included six direct spots and two inter-confederation play-off spots for the CONCACAF region. However, in a change of format from previous World Cups, there would be no dedicated host country slot, with the slots of automatically qualifying host countries now taken from the quota of its confederation. If the tournament were to be co-hosted, the FIFA Council would decide which host countries would qualify automatically.[1] On 13 June 2018, three members of CONCACAF—Canada, Mexico and the United States—were selected as hosts for the 2026 World Cup by the 68th FIFA Congress.[2]

On 14 February 2023, the FIFA Council awarded automatic berths for all three host countries, leaving three direct slots and two inter-confederation play-off slots to be decided through CONCACAF qualification.[3] On 28 February, CONCACAF announced the qualifying format for 2026 World Cup qualification.[4]

First round: Four CONCACAF teams, ranked 29 to 32 based on the FIFA rankings of December 2023, were divided into two matchups, played on a two-legged home-and-away basis. The two winners advanced to the second round.
Second round: Thirty teams, the two winners from the first round and CONCACAF teams ranked 1 to 28 based on the FIFA rankings of December 2023, were drawn into six groups of five teams. They played single round-robin matches (two home and two away), with group winners and runners-up advancing to the third round.
Third round: The twelve teams advancing from the second round were drawn into three groups of four teams. They will play double round-robin home-and-away matches, with the three group winners qualifying for the World Cup. The two best-ranked runners-up will advance to the inter-confederation play-offs.
Entrants
As Canada, Mexico and the United States were awarded automatic berths as co-hosts, they did not enter qualifying. The remaining 32 FIFA-affiliated national teams from CONCACAF entered qualification. Based on the FIFA rankings of December 2023, the top 28 teams received a bye to the second round, while the lowest four teams entered the first round.[5]
"""

encoder = Tokenizer(vocab_size=270)

e = encoder.train(data)

en = encoder.encode(data)

print(e == en)