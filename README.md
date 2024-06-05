# UrbanLux

## Description

**UrbanLux** is the backend NestJs application for an E-commerce application
I have used Microservice architecture. The project is organized as a monorepo. I used RabbitMQ as messaging broker between microservices and PostgreSQL for database.

## Live Demo

TBA
A live version of the application is hosted [TBA](TBA).

The service is deployed in free tier and may not be available instantly. Please wait a few minutes for the application to start

## Getting Started

Please clone the repositiry from Github using the following link

```
https://github.com/ram1117/urbanlux.git
```

### Dependencies

- Need PNPM to install the packages needed for the project
- Need Git and Github account to setup and contribute to the project
- Need Docker engine to run MongoDB and RabbitMQ in a docker container.

## Installing

Please run the following command to install the npm dependency packages.

```bash
$ pnpm install
```

Before running the app, you will need to run docker container to use database as a docker image. Run the following command to start the docker postgres image(Docker Desktop or Docker Engine need to be installed for this). If you have postgres installed in your system, you do not need to run the docker.

```bash
$ docker compose up -d
```

## Running the app

To start the NestJs app, run one of the following commands.

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Help

Please raise a Github issue for errors or bugs.

https://github.com/ram1117/urbanlux/issues

## Authors

### Ram Kumar Karuppusamy

[@ram1117](https://github.com/ram1117) <br />
[ram kumar karuppusamy](https://www.linkedin.com/in/ram-kumar-karuppusamy/)

## Version History

- 0.1
  - Initial Release

## License

This project is [MIT](./LICENSE) licensed. See the LICENSE.md file for details
