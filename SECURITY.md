# Security — future-block TAPOS (fallback)

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Resolve / ready before `open + delay` | too early |
| Resolve after expire window | expired |
| Second resolve | already resolved |
| Delay 0 / bad memo seed | refused on open |
| Same blockId + seed | deterministic digest |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Block producer influence | Future block id is not oracle-grade on all networks |
| Seed grinding at open | Combine with long delay; prefer orng |
| Live block id reads | Injected `blockId` in tests is not a chain read |
| Refund on expire | Product must define who receives the stake |
| Auth | Who may open / markReady / resolve |

## Attack angles

1. Resolving on the open block (no delay).
2. Using a block id already known to the player at open time.
3. Double resolve after expire without clearing the bet.
4. Shipping this on WAX mainnet while `orng.wax` is available.

## Honesty limits

Structural timing only. **Not** `orng.wax`. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). Related: [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) · [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier).
