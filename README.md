# NestJS Enterprise REST API Boilerplate 🚀

A production-ready, scalable Backend architecture built with **NestJS**, **Prisma**, and **TypeScript**. 
This repository implements best practices for modern backend development, focusing on security, type safety, and developer experience.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🌟 Key Features

### 🔐 Advanced Authentication & Security
- **Dual Token System**: Implemented Access Token (Short-lived) and Refresh Token (Long-lived) flow.
- **Refresh Token Rotation**: Automatic token rotation on refresh to prevent replay attacks and token theft.
- **Secure Hashing**: Passwords are hashed using **Argon2** (or Bcrypt) before storage.
- **Guards & Decorators**: Custom `@CurrentUser()` decorator and reusable AuthGuards.

### 🏗 System Architecture
- **Type-Safe Configuration**: Uses `@nestjs/config` with **Joi Validation Schema**. The app will fail to start if required environment variables are missing (Fail-fast principle).
- **Domain-Driven Structure**: Modular architecture separating concerns (Auth, Users, Shared Modules).
- **Global Error Handling**: Centralized Exception Filter to catch Prisma/Database errors (e.g., Unique Constraint violations) and transform them into user-friendly HTTP responses.

### 💾 Database & ORM
- **Prisma ORM**: Fully typed database access.
- **Dockerized Database**: Includes `docker-compose.yml` for spinning up PostgreSQL and Redis instantly.

---

## 🛠 Prerequisites

- Node.js (v18 or later)
- Docker & Docker Compose (Optional, but recommended for DB)
- PostgreSQL (If not using Docker)

---

## 🚀 Getting Started

```bash
# 1. Clone & Install
git clone [https://github.com/suradachk/nestjs-prisma.git](https://github.com/suradachk/nestjs-prisma.git)
cd nestjs-prisma
npm install

# 2. Setup Environment
cp .env.example .env
# (Don't forget to edit .env details!)

# 3. Setup Database (Docker)
docker-compose up -d
npx prisma migrate dev --name init

# 4. Run App
npm run start:dev
