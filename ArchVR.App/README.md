# ArchVR.App

Main Nuxt App, Front and Backend.

Built with TRPC, Next Auth, Vee Validate, Zod, Prisma, ReteJS, BabylonJS and ❤️

## Setup

Here's how to setup

### 1. Build dependencies

You must build the 3D Editor as an external dependency

Go to the ArchVR.3D and...

```bash
npm i
npm run build
```

install dependencies here too

```bash
npm i
```

### 2. Setup envars

Copy .env.example into .env

```bash
cp .env.example .env
```

### 3. Spin up DB

assuming you've got docker

```bash
  docker-compose up
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

### 5. Run dev

```bash
npm run dev
```

Hopefully you'll be able to visit `http://localhost:3000`:

### 6. Create an account

You can use the shoddy local thing I wrote or github whatever

### 7. Create things

1. Upload a couple of models - provided in TDVP.Files
2. Create a project
3. Create a scene
4. Add a model if you wanna
5. Add a widget
