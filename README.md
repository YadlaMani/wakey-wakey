# Wakey-Wakey: Decentralized Uptime Monitoring Platform

Website owners constantly worry about the uptime and performance of their websites, as downtime or slow response times can lead to revenue loss and poor user experience. Traditional monitoring solutions rely on centralized infrastructure, which can be limited in geographic coverage, prone to single points of failure, and expensive.

## Overview

**Wakey-Wakey** is a decentralized uptime monitoring platform that leverages a global network of validators running on public infrastructure. This platform monitors website availability every 3 minutes from various locations worldwide, providing real-time latency and response time analytics to website owners. Validators contribute their idle resources to perform these checks and are rewarded with small amounts of SOL for their participation.

This decentralized approach ensures:

- **Greater reliability**: No single point of failure.
- **Wider coverage**: Validators from around the globe monitor websites.
- **Cost efficiency**: Affordable for website owners and rewarding for validators.

## Features

- **Global Uptime Monitoring**: Websites are monitored from multiple locations worldwide.
- **Real-Time Analytics**: Provides latency and response time insights to website owners.
- **Decentralized Validators**: Validators perform checks using their idle resources.
- **Rewards System**: Validators earn SOL for their contributions.
- **Resilient Infrastructure**: Decentralized architecture ensures high availability and reliability.

## Architecture

The platform consists of the following components:

### Apps

- **API**: A backend service that handles website and validator management, authentication, and data storage.
- **Hub**: A WebSocket server that coordinates communication between validators and the platform.
- **Validator**: A lightweight application run by validators to perform website checks and report results.
- **Web**: A Next.js-based frontend for website owners and validators to interact with the platform.

### Packages

- **Common**: Shared types and utilities used across the platform.
- **DB**: Prisma-based database client for managing data.
- **UI**: A React component library for consistent UI across the platform.
- **ESLint Config**: Shared ESLint configurations for code quality.
- **TypeScript Config**: Shared TypeScript configurations for type safety.

## How It Works

1. **Website Owners**: Add their websites to the platform via the web app.
2. **Validators**: Connect to the platform and perform periodic checks on websites.
3. **Hub**: Distributes website monitoring tasks to validators every 3 minutes.
4. **API**: Stores monitoring results and provides analytics to website owners.
5. **Rewards**: Validators earn SOL for successfully completing monitoring tasks.

## Screenshots

![image](https://github.com/user-attachments/assets/6405a228-c3df-4862-8c9d-238673db723e)
![image](https://github.com/user-attachments/assets/0ac41d04-dde6-446e-942e-e79306bb2a4d)
![image](https://github.com/user-attachments/assets/26184c7e-ff5c-4e56-a2f6-eec396b0f02d)
![image](https://github.com/user-attachments/assets/a63935b2-9af9-495d-970b-0623a44c9321)

## Getting Started

### Prerequisites

- Node.js >= 18
- Bun >= 1.2.4
- PostgreSQL database

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/YadlaMani/wakey-wakey.git
cd wakey-wakey
bun install
```

### Development

Start the development environment:

```sh
bun run dev
```

### Build

Build all apps and packages:

```sh
bun run build
```

## Contributing

We welcome contributions to improve Wakey-Wakey! Please follow the [contribution guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Turborepo](https://turbo.build/repo) for efficient monorepo management.
- Powered by [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [Bun](https://bun.sh).
- Inspired by the need for resilient and decentralized internet infrastructure.

---

**Wakey-Wakey**: Enhancing website reliability, one validator at a time.
