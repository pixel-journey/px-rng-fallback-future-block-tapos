# Education — delay until a future block

## Beginner

A bet opens at block N and may only resolve at or after N + delay. The entropy is mixed from that future block id and a memo seed. If the window passes, the job expires without a digest.

## Intermediate

| Field | Meaning |
| --- | --- |
| `resolveAfter` | first legal block |
| `expireAt` | `resolveAfter + windowBlocks` in this lab |
| `mixDigest` | deterministic mix of block id and memo seed |

`markReady` is optional bookkeeping; `resolve` enforces the same early bound.

## Masterclass (not in this repo)

- Reading a real block id via TAPOS / host API.
- Paying a game from `uint32FromDigest`.
- What happens if producers can grind the block id (trust model).

## Outcomes

1. Compute `resolveAfter` and `expireAt` from open, delay, window.
2. Show double resolve is refused.
3. Show two memos on one block id produce different digests.
