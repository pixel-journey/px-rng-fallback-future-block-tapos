# Security notes — TAPOS delay

| Mitigated | Behavior |
| --- | --- |
| Too early resolve | refused |
| Expired | expire path / refuse resolve |
| Double resolve | refused |
| Bad memo / delay bounds | refused |

Production threat model: producer influence, timing, and user grief on windows. Prefer oracle on WAX.
