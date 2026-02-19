const amqp = require('amqplib');

async function sendTask(message) {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'task_queue';

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(message), {
    persistent: true
  });

  console.log(' [x] Sent "%s"', message);

  await channel.close();
  await connection.close();
}

const message = process.argv.slice(2).join(' ') || 'Hello World!';

sendTask(message).catch(console.error);