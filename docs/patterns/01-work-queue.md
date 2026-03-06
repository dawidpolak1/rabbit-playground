# Work Queue Pattern

## Overview

Distribute tasks across multiple workers using a queue. Only one consumer processes each message (competing consumers pattern).

**Real-world use:** Background job processing, email sending, PDF generation

---

## Architecture

```
┌──────────┐     ┌─────────────┐     ┌────────────┐
│ Producer │────▶│ task_queue  │────▶│  Worker 1  │
└──────────┘     └─────────────┘     │  Worker 2  │
                                      │  ...       │
                                      └────────────┘
```

---

## How It Works

1. **Startup**: Producer and Consumer both declare a durable queue named `task_queue`;
2. **Publish**: Producer sends messages to the queue with `persistent: true`;
3. **Distribution**: RabbitMQ delivers messages to consumers in round-robin fashion;
4. **Processing**: Each message is processed by exactly ONE consumer;
5. **Acknowledgment**: Consumer sends ACK after work completes (not before!).

### Key Mechanisms

- **Round-robin**: Messages alternate between available consumers;
- **Prefetch(1)**: Consumer only receives one message at a time (fair distribution);
- **Manual ACK**: Message only removed from queue after successful processing.

---

## Key RabbitMQ Concepts

| Concept | What It Means | Why It Matters |
|---------|---------------|----------------|
| **Durable queue** | Queue survives broker restart | No queue recreation needed after restart |
| **Persistent message** | Message saved to disk | Messages survive broker restart |
| **Manual ACK** | Consumer confirms message processed | Prevents message loss if consumer crashes |
| **Prefetch** | Limit unacknowledged messages per consumer | Ensures fair distribution |

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
2. **POST** `/work-queue/producer/send` - Send a task
3. **GET** `/work-queue/consumer/consume` - Start consuming

### Via Standalone Script

A standalone Node.js producer script for quick testing without starting the full NestJS app:

```bash
# Send a task (dots = seconds of work: "Hello..." = 3 seconds)
node scripts/work-queue-producer.js "Process order #123..."

# Default message if none provided
node scripts/work-queue-producer.js
```

**Note:** This requires RabbitMQ running (`docker-compose up -d`) and `amqplib` installed (`npm install amqplib`).

---

### Via cURL

```bash
# Send a task (dots = seconds of work: "Hello..." = 3 seconds)
curl -X POST http://localhost:3000/work-queue/producer/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Process order #123..."}'

# Start consumer (in separate terminal or app instance)
curl http://localhost:3000/work-queue/consumer/consume
```

### Test Round-Robin Distribution

1. **Terminal 1**: `npm run start:dev` then `curl http://localhost:3000/work-queue/consumer/consume`
2. **Terminal 2**: `PORT=3001 npm run start:dev` then `curl http://localhost:3001/work-queue/consumer/consume`
3. **Terminal 3**: Send 5 messages and watch them alternate between consumers

**Expected output:**
```
Consumer 1: [x] Received First message.
Consumer 2: [x] Received Second message..
Consumer 1: [x] Done
Consumer 1: [x] Received Third message...
Consumer 2: [x] Done
Consumer 2: [x] Received Fourth message....
...
```

---

## Implementation

- Producer: `src/patterns/work-queue/producer/`
- Consumer: `src/patterns/work-queue/consumer/`
- Shared: `src/frameworks/rabbit/queues.ts`

---

## Common Pitfalls

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Forgetting `channel.ack(msg)` | Messages reappear after consumer restart | Always ACK after processing |
| Missing `prefetch(1)` | One consumer gets all messages | Call `prefetch(1)` before `consume()` |
| Non-durable queue | Queue disappears on restart | Use `durable: true` in `assertQueue()` |
| Non-persistent messages | Messages lost on restart | Add `persistent: true` to `sendToQueue()` |
| ACK before processing | Message lost if consumer crashes | ACK only AFTER work completes |

---

## Further Reading

- [RabbitMQ Tutorial 2: Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-javascript)
- [RabbitMQ Prefetch](https://www.rabbitmq.com/docs/consumer-prefetch)
- [RabbitMQ Reliability Guide](https://www.rabbitmq.com/docs/reliability)
