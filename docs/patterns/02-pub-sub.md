# Pub-Sub Pattern (Fanout Exchange)

## Overview

Broadcast messages to ALL subscribers using a fanout exchange. Every subscriber receives every message (one-to-many pattern).

**Real-world use:** Logging systems, notifications, event broadcasting, cache invalidation

---

## Architecture

```
┌──────────┐     ┌───────────────┐
│ Producer │────▶│ logs (fanout) │
└──────────┘     └───────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │Subscr. 1 │ │Subscr. 2 │ │Subscr. N │
   └──────────┘ └──────────┘ └──────────┘
```

---

## How It Works

1. **Startup**: Service asserts a fanout exchange named `logs`
2. **Subscribe**: Each subscriber creates its own temporary exclusive queue and binds to the exchange
3. **Publish**: Producer publishes message to the exchange (routing key is ignored)
4. **Broadcast**: Exchange copies message to ALL bound queues
5. **Receive**: Every subscriber gets the message

### Key Mechanisms

- **Fanout exchange**: Ignores routing key, broadcasts to all bound queues
- **Temporary queues**: Auto-generated names, deleted when consumer disconnects
- **Exclusive**: Queue only accessible by the connection that created it

---

## Key RabbitMQ Concepts

| Concept | What It Means | Why It Matters |
|---------|---------------|----------------|
| **Fanout exchange** | Broadcasts to all bound queues | Enables one-to-many messaging |
| **Exclusive queue** | Only accessible by creator connection | Auto-deleted on disconnect |
| **Temporary queue** | Server-generated name (`amq.gen-xxx`) | No queue management needed |
| **noAck** | Auto-acknowledge messages | Simpler but less reliable |

---

## Testing

### Prerequisites

```bash
# Start RabbitMQ
docker-compose up -d

# Start the app
npm run start:dev
```

### Via Swagger UI

1. Open http://localhost:3000/rabbit-playground
2. **POST** `/pub-sub/subscribe` - Create a subscriber
3. **POST** `/pub-sub/emit` - Broadcast a message

### Via cURL

```bash
# Subscribe to broadcasts (run multiple times for multiple subscribers)
curl -X POST http://localhost:3000/pub-sub/subscribe

# Emit a message (all subscribers receive it)
curl -X POST http://localhost:3000/pub-sub/emit \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello everyone!"}'
```

### Test Broadcasting

1. **Terminal 1**: `npm run start:dev` then `curl -X POST http://localhost:3000/pub-sub/subscribe`
2. **Terminal 2**: `PORT=3001 npm run start:dev` then `curl -X POST http://localhost:3001/pub-sub/subscribe`
3. **Terminal 3**: Emit a message → watch BOTH terminals receive it

**Expected output:**
```
Terminal 1: [PubSubService] Received: {"message":"Hello everyone!"}
Terminal 2: [PubSubService] Received: {"message":"Hello everyone!"}
```

---

## Implementation

- Controller: `src/patterns/pub-sub/pub-sub.controller.ts`
- Service: `src/patterns/pub-sub/pub-sub.service.ts`
- Exchange: `src/patterns/pub-sub/exchanges.ts`

---

## Comparison: Work Queue vs Pub-Sub

| Aspect | Work Queue | Pub-Sub |
|--------|------------|---------|
| Exchange | None (direct to queue) | Fanout |
| Message delivery | One consumer | All consumers |
| Queue type | Durable, named | Temporary, auto-named |
| Use case | Task distribution | Broadcasting |

---

## Common Pitfalls

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Named queue instead of temp | All subscribers share one queue | Use `assertQueue('', { exclusive: true })` |
| Non-exclusive queue | Queues pile up after disconnect | Always use `exclusive: true` |
| Missing bind | Messages not received | Call `bindQueue()` after creating queue |
| Using routing key | Key is ignored anyway | Fanout ignores routing keys by design |

---

## Further Reading

- [RabbitMQ Tutorial 3: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-javascript)
- [RabbitMQ Exchanges](https://www.rabbitmq.com/docs/exchanges)
