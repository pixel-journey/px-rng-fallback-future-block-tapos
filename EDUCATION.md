# Education — delayed TAPOS seed

For chains without orng.wax: open a job at block N, resolve only after N+delay using the future block id mixed with a memo seed.

## Outcomes

1. Show resolve before delay is refused.
2. Show digests are deterministic for the same block id and seed.
3. Show the expire window ends the job without a second resolve.
