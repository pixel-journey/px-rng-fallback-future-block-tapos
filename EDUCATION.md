# Education

A bet that "rolls" in the same transaction as it opens can be ground against by anyone who sees the pending block. Delaying resolve until a later block makes the entropy depend on information that did not exist at open time.

This is **not** a synchronous RNG and **not** a substitute for `orng.wax`. Producers still influence future block ids; the delay only removes same-block grinding. Use it as a fallback on chains without a dedicated RNG service, with clear product language that settlement is async.
