# RabbitMQ Playground (NestJS)

> Learn RabbitMQ patterns with NestJS and amqplib - no framework magic.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+

## Quick Start

```bash
# 1. Start RabbitMQ
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Start the app
npm run start:dev
```

Open Swagger: http://localhost:3000/rabbit-playground
Open RabbitMQ Management: http://localhost:15672 (guest/guest)

## Patterns

| Pattern | Description | Docs |
|---------|-------------|------|
| Work Queue | Competing consumers distribute tasks | [docs/patterns/01-work-queue.md](docs/patterns/01-work-queue.md) |
| Pub-Sub | Broadcast messages to all subscribers | [docs/patterns/02-pub-sub.md](docs/patterns/02-pub-sub.md) |
| Routing | Route messages by routing keys | [docs/patterns/03-routing.md](docs/patterns/03-routing.md) |

## Commands

```bash
npm run start:dev    # Development mode
npm run lint         # Lint code
```

## Testing Tools

- **Swagger UI**: http://localhost:3000/rabbit-playground
- **RabbitMQ Management**: http://localhost:15672
- **Standalone script**: `node scripts/work-queue-producer.js "your message"`

## Project Structure

```
src/
├── frameworks/rabbit/     # Core RabbitMQ infrastructure
└── patterns/              # Pattern implementations
```

## Tech Stack

- NestJS + TypeScript
- amqplib (direct AMQP protocol)
- RabbitMQ 4

## License

MIT
