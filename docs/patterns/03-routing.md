# Routing Pattern (Direct Exchange)

## Overview

Route messages to specific consumers based on routing keys. Different services receive different events (selective routing pattern).

**Real-world use:** Order events, user notifications, domain events in microservices

---

## Architecture

```
┌───────────┐     ┌──────────────────┐
│  Order    │     │ order_events     │
│  Service  │────▶│    (direct)      │
└───────────┘     └──────────────────┘
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
┌───────────┐    ┌───────────┐    ┌───────────┐
│ Inventory │    │ Shipping  │    │   Email   │
│  Service  │    │  Service  │    │  Service  │
└───────────┘    └───────────┘    └───────────┘
```

---

## How It Works

1. **Startup**: Service asserts a direct exchange named `order_events`
2. **Consumer setup**: Each consumer creates a queue and binds to specific routing keys
3. **Publish**: Producer publishes message with a routing key (e.g., `order.created`)
4. **Routing**: Exchange routes message only to queues bound to that key
5. **Selective delivery**: Only interested consumers receive the message

### Key Mechanisms

- **Direct exchange**: Routes messages based on exact routing key match
- **Routing key binding**: Consumer specifies which keys to receive
- **Multiple bindings**: One queue can bind to multiple keys

---

## Available Routing Keys

| Routing Key | Meaning | Who Receives |
|-------------|---------|--------------|
| `order.created` | New order placed | Inventory, Email |
| `order.paid` | Payment confirmed | Shipping |
| `order.shipped` | Order dispatched | Email |
| `order.cancelled` | Order cancelled | Inventory, Email |

---

## Key RabbitMQ Concepts

| Concept | What It Means | Why It Matters |
|---------|---------------|----------------|
| **Direct exchange** | Routes by exact key match | Enables selective routing |
| **Routing key** | Message attribute for routing | Determines destination |
| **Queue binding** | Links queue to exchange + key | Subscribes to specific events |
| **Multiple bindings** | One queue, multiple keys | One consumer handles multiple events |

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
2. **POST** `/routing/producer/create-order` - Emit `order.created`
3. **POST** `/routing/producer/pay-order` - Emit `order.paid`
4. **POST** `/routing/producer/ship-order` - Emit `order.shipped`
5. **POST** `/routing/producer/cancel-order` - Emit `order.cancelled`

### Via cURL

```bash
# Create order (→ Inventory + Email receive)
curl -X POST http://localhost:3000/routing/producer/create-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-123"}'

# Pay order (→ Shipping receives)
curl -X POST http://localhost:3000/routing/producer/pay-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-123"}'

# Ship order (→ Email receives)
curl -X POST http://localhost:3000/routing/producer/ship-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-123","trackingNumber":"TRK-456","carrier":"FedEx"}'

# Cancel order (→ Inventory + Email receive)
curl -X POST http://localhost:3000/routing/producer/cancel-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-123"}'
```

### Verify Selective Routing

Watch the logs when you emit different events:

```
[POST /create-order]
  InventoryServiceConsumer: [x] Received order.created
  EmailServiceConsumer: [x] Received order.created
  (Shipping does NOT receive)

[POST /pay-order]
  ShippingServiceConsumer: [x] Received order.paid
  (Inventory + Email do NOT receive)
```

---

## Implementation

- Producer Controller: `src/patterns/routing/routing-producer.controller.ts`
- Service: `src/patterns/routing/routing.service.ts`
- Definitions: `src/patterns/routing/definitions/`
- Consumers: `src/patterns/routing/consumers/`

---

## Comparison: Pub-Sub vs Routing

| Aspect | Pub-Sub (Fanout) | Routing (Direct) |
|--------|------------------|------------------|
| Exchange type | Fanout | Direct |
| Routing key | Ignored | Exact match |
| Delivery | All subscribers | Selective subscribers |
| Use case | Broadcasting | Event routing |

---

## Common Pitfalls

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong routing key | Message not delivered | Check exact key match (case-sensitive) |
| Missing binding | Consumer doesn't receive | Verify `bindQueue()` with correct key |
| Typo in key name | Silent failure (unroutable) | Use constants for routing keys |
| Forgetting ACK | Messages reprocessed | Always `channel.ack(msg)` after handling |

---

## Further Reading

- [RabbitMQ Tutorial 4: Routing](https://www.rabbitmq.com/tutorials/tutorial-four-javascript)
- [RabbitMQ Direct Exchange](https://www.rabbitmq.com/docs/exchanges#direct)
