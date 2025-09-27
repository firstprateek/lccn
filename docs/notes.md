# CAP vs PACELC (V1 stance)

- **During partitions (CAP)**: prioritize **Availability** (local edits continue); reconcile to **eventual Consistency** post-reconnect.
- **Else (PACELC)**: favor **Latency** for local writes/reads; strong consistency deferred to sync phases.
- **Read-your-writes**: guaranteed locally; **not guaranteed** across devices until sync completes.
- **Retries + idempotency**: snapshot/import ops are idempotent; client retries safe on reconnect.
- **Contract (V1)**: eventual consistency across peers; conflict policy documented alongside sync format.
