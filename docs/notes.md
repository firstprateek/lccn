# CAP vs PACELC (V1 stance)

- **During partitions (CAP)**: prioritize **Availability** (local edits continue); reconcile to **eventual Consistency** post-reconnect.
- **Else (PACELC)**: favor **Latency** for local writes/reads; strong consistency deferred to sync phases.
- **Read-your-writes**: guaranteed locally; **not guaranteed** across devices until sync completes.
- **Retries + idempotency**: snapshot/import ops are idempotent; client retries safe on reconnect.
- **Contract (V1)**: eventual consistency across peers; conflict policy documented alongside sync format.

## Client caching layers (Day 2)

- **SW (app shell)**: cache-first for HTML/CSS/JS → instant offline load.
- **Data**: future API will be network-first with SWR fallback; today IDB is the source.
- **Local state**: keep current notebook in memory; persist edits immediately to IDB.
- **Invalidation**: bump shell cache on deploy; data version stamp in `meta` store.
- **Perf**: cold start target <1.5s; never block first paint on IDB—render shell, then hydrate.
