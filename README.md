# px-rng-fallback-future-block-tapos

> **Trust:** private educational lab (Tier B)  
> **Quest:** 014 — delayed TAPOS + memo seed (not synchronous RNG)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

Open a job at `openBlock` with a client memo seed. Resolve is refused until `openBlock + delayBlocks`. Digest = `sha256(blockId || memoSeed)`. Past `expireAt` the job expires without a digest.

**Real code:** `npm test`. Block ids here are lab stand-ins, not live chain TAPOS. No wasm.

## Run

```bash
npm test
```

MIT — Pixel Journey
