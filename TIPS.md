# Tips — future-block TAPOS (fallback)

Educational delay-based entropy for chains **without** `orng.wax`. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.

## What this is

A bet commits to a **future** block reference (TAPOS / block id) plus an optional memo seed. Resolution waits until that block exists, then mixes the committed material. It is **not** a threshold oracle and is **not** synchronous RNG.

## Do

- Enforce delay ≥ 1 block (tests lock a positive lag).
- Document expire and refund: if the target block never arrives or the window closes, who gets the stake.
- Resolve **once**. A second resolve is a double-pay.
- Length/hex-check any memo seed the player supplies.

## Don't

- Market TAPOS delay as equivalent to RSA-threshold orng.
- Resolve twice.
- Accept unstructured free-form seeds with no bounds (CPU / storage grief).
- Let the player choose a block that already landed (they may have seen the id).

## Common mistakes

1. Using the **current** block id as the entropy source (miner/producer influence and foresight).
2. No refund path when the chain skips or the delay is mis-set.
3. Treating this as a replacement for credits + orng on WAX mainnet.
4. Confusing TAPOS (transaction reference fields) with “pick any historical block hash.”

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Bond if house withholds resolve | [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) |
| External time beacon | [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) |
| Multi-oracle XOR | [quorum](https://github.com/pixel-journey/px-rng-fallback-multi-oracle-quorum) |

Related: [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) · [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) · `px-contract-examples-vault` (private index; not this public course)
