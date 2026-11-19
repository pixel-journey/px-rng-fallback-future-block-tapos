# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Blocks, TAPOS concepts |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Transaction / block headers |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | **Preferred** alternative on WAX |
| [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | Sample dapp path |

Future-block mixing is an **educational fallback**. Block producer influence and seed grinding make it weaker than a dedicated oracle service.

## Product facts locked by tests

- `resolveAfter = openBlock + delay`. Resolve before that is **too early**.
- Delay **0** is refused on open. Memo seed must be valid hex in this lab.
- Same blockId + seed → same digest (length 64). Different seed differs.
- After `expireAt`, resolve is `expired`. Second resolve is refused.
- This is **not** a synchronous RNG. Prefer `orng.wax` on WAX mainnet.

## Related labs

| Lab | Topic |
| --- | --- |
| [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) | Bonded house reveal |
| [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Strict post-bet public randomness |
| [quorum](https://github.com/pixel-journey/px-rng-fallback-multi-oracle-quorum) | M-of-N committee |
| [ORNG path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Full curriculum order |
