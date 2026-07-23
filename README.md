<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

Backend de tip Task Management dezvoltat în **NestJS** în cadrul stagiului de practică. Proiectul include autentificare JWT, operații CRUD complete pentru board-uri și carduri, precum și procesare asincronă cu BullMQ și Redis.

---

## Tehnologii Utilizate
* **Framework:** NestJS
* **Bază de date & ORM:** MySQL, Prisma ORM
* **Cozi de mesaje / Asincron:** BullMQ, Redis
* **Securitate:** Passport.js, JWT, Bcrypt
* **Testare:** Jest (Unit Tests)

---

## Instalare și Configurare

1. **Instalează dependențele:**
   ```bash
   npm install

## Rulare aplicatia
$ npm run start:dev

## Rulare teste
# unit tests
$ npm run test
test specific (ex: card service)
$ npx jest card.service.spec.ts