# Education — future-block TAPOS fallback

> **Rung:** `npm test` passes. **Not** a synchronous RNG. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.

## What you should be able to do

| Level | Skill |
| --- | --- |
| Beginner | Entropy only after `openBlock + delay` |
| Intermediate | Resolve window then expire |
| Masterclass | Why producers can influence future block ids; why oracles win on WAX |

## Beginner

Open a job with a **memo seed**. Resolution is illegal until `currentBlock >= resolveAfter`. Digest mixes a **future** block id with the seed (`mixDigest`).

## Intermediate

Phases: `open` → `ready` / `resolved` / `expired`. After `expireAt`, resolve becomes expire. Second resolve refused.

Composition: multi-job independent delay lifecycle.

## Masterclass

- Block producers and timing games can bias who resolves when.
- This lab uses a **synthetic** `blockIdHex` for tests — not live TAPOS fields.
- Production on WAX should use orng.wax unless you are on a chain without an oracle and accept the threat model.

## Will not teach

Live chain id / ref_block_prefix extraction, or that this is safe for high-value WAX mainnet games.
