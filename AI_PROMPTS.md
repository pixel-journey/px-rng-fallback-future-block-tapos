# AI handoff — future-block TAPOS fallback

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | **Preferred** on WAX |
| [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) | Bonded house |
| [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Public beacon |

## Non-negotiables

1. Educational fallback. BP influence and seed grinding make it weaker than a dedicated oracle.
2. `resolveAfter = openBlock + delay`. Resolve before that is **too early**.
3. Delay **0** is refused on open. Memo seed must be valid hex in this lab.
4. Same blockId + seed → same digest (length 64). Different seed differs.
5. After `expireAt`, resolve is `expired`. Second resolve is refused.
6. **Not** synchronous RNG. Prefer `orng.wax` on WAX mainnet.
7. Do **not** tag this lab `orng`.

## Prompt seeds

- "Resolve one block early — too early?"
- "Delay 0 on open — refused?"
- "Why prefer orng over TAPOS on WAX?"
- "Show expire path refuses second resolve."

## Do not

- Claim this is production-grade fairness on WAX.
- Resolve before resolveAfter.
- Label the repo topic `orng`.
