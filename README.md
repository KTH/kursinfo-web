# Welcome to kursinfo-web 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

### 🏠 [Homepage](https://github.com/KTH/kursinfo-web)

## Overview

Kursinfo-web is a microservice with the public view of course information. It uses [React](https://reactjs.org//), [MobX](https://mobx.js.org/), and is based on [node-web](https://github.com/KTH/node-web).

### API:s

Kursinfo-web fetches data from:

- Course information API
  - Dev (Stage): [api-r.referens.sys.kth.se/api/kursinfo](https://api-r.referens.sys.kth.se/api/kursinfo)
  - Prod (Active): [api.kth.se/api/kursinfo](https://api.kth.se/api/kursinfo)
- API to generate course syllabuses’ PDF:s
  - Dev (Stage): [api-r.referens.sys.kth.se/api/kursplan](https://api-r.referens.sys.kth.se/api/kursplan)
  - Prod (Active): [api.kth.se/api/kursplan](https://api.kth.se/api/kursplan)
- Course memo API
  - Dev (Stage): [api-r.referens.sys.kth.se/api/kurs-pm-data](https://api-r.referens.sys.kth.se/api/kurs-pm-data)
  - Prod (Active): [api.kth.se/api/kurs-pm-data](https://api.kth.se/api/kurs-pm-data)
- API för kurs- och programinformation
  - Dev (Stage): [api-r.referens.sys.kth.se/api/kopps/v2/](https://api-r.referens.sys.kth.se/api/kopps/v2/)
  - Prod (Active): [api.kth.se/api/kopps/v2/](https://api.kth.se/api/kopps/v2/)

### Related projects

- [kursinfo-admin-web](https://github.com/KTH/kursinfo-admin-web)
- [kursinfo-api](https://github.com/KTH/kurs-pm-data-api)
- [kursplan-api](https://github.com/KTH/kursplan-api)
- [kurs-pm-data-api](https://github.com/KTH/kurs-pm-data-api)
- [node-web](https://github.com/KTH/node-web)

## Prerequisites

- Node.js 18.0.0
- Ansible Vault

### Secrets for Development

Secrets during local development are stored in a `.env` file in the root of your project. This file should be in `.gitignore`. Template for `.env` with all needed environment variables are available in the `env.in` file.

Secrets (names, passwords, keys, and uri:s) for dev and prod are stored in the the course information project’s Azure key vault.

## For Development

### Install

First time you might need to use options `--ignore-scripts` because of npm resolutions:

```sh
npm install --ignore-scripts
```

or

```sh
npm install

```

You might need to install as well:

```sh
npm install cross-env
npm install concurrently
```

### Usage

Start the service on [localhost:3000/student/kurser/kurs/:courseCode](http://localhost:3000/student/kurser/kurs/:courseCode).

```sh
npm run start-dev
```

### Debug in Visual Studio Code

It's possible to use debugging options available in Visual Studio Code
Add to .vscode file launch.json:

- _Microsoft_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursinfo-web",
      "program": "${workspaceFolder}\\app.js",
      "envFile": "${workspaceFolder}\\.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

- _Mac, Unix and so on_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursinfo-web",
      "program": "${workspaceFolder}/app.js",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Deploy

The deployment process is described in [Build, release, deploy](https://confluence.sys.kth.se/confluence/x/aY3_Ag). Technical details, such as configuration, is described in [How to deploy your 🐳 application using Cellus-Registy](https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/HOW-TO-DEPLOY.md) and [🔧 How To Configure Your Application For The Pipeline](https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/HOW-TO-CONFIGURE.md).

## Author

👤 **KTH**

- Website: [kth.github.io/](https://kth.github.io/)
- Github: [@KTH](https://github.com/KTH)
