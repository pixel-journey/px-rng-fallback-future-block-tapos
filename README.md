# Delayed future-block entropy (TAPOS-style fallback)

> **Domain:** RNG fallback — not synchronous  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Entropy is fixed only after a later block: open with memo seed, resolve after delay, expire after window. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.

**Code under test:** `npm test` (unit + multi-job composition). Synthetic block ids in tests — no live chain.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Ready, resolve, expire |
| [TIPS.md](TIPS.md) | Prefer oracle |
| [SECURITY.md](SECURITY.md) | Timing threats |
| [SOURCES.md](SOURCES.md) | Official + related |

## What is true (executed)

| Rule | Result |
| --- | --- |
| Before resolveAfter | too early |
| Within window | digest from block id + memo |
| Past expireAt | expired |
| Second resolve | refused |

```bash
npm test
```

MIT — Pixel Journey
