# Official sources

Using a **future block id** as entropy is a known pattern and is weaker than a dedicated oracle: producers influence block ids. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) when available.

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Primary WAX randomness |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Transactions, TAPOS fields, block headers |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Chain / history reads for block ids |

Block ids in this lab are **stand-ins**. Digest = `sha256(blockId || memoSeed)` is the educational rule only.

## Domain map

| Repo | Role |
| --- | --- |
| [px-rng-fallback-commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) | Two-party commit-reveal |
| **This repo** | Delay gates + blockId||memo digest |
| ORNG domain | Production oracle path |
