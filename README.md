
# Kairos

## Description

A scheduler microservice which accepts schedule event from RabbitMQ. On execution of the event, it will send an event to the specified queue.

## Installation

```bash
$ npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
