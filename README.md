# ArchVR

A browser-based digital twin editor. Upload 3D models, arrange them into scenes, and bind live device data to objects and dashboard widgets through a visual node graph. No code required to wire a sensor to a moving part or a chart.

ArchVR is a working title. The project is a prototype: device data is currently simulated in the browser, and there's no connection to a real message broker yet.

## What it does

- **Scenes.** Organisations own projects, projects own scenes. A scene holds models, devices and widgets.
- **3D editor.** Place and transform GLB models in the browser. IFC property sets are shown for objects that carry them.
- **Devices.** Each device is identified by a hierarchical topic, for example `UK.SHF.BLD.Cell1.MA1.spindle`.
- **Node graphs.** Wire a device's output through maths and vector nodes into an object's transform or a widget. Ports and wires are coloured by data type.
- **Widgets.** KPI and line chart widgets sit over the scene and update as data arrives.

## Repository layout

| Path | What it is |
|-|-|
| `ArchVR.App` | Nuxt 3 application. Front end, API and database access. |
| `ArchVR.3D` | The 3D editor, built on BabylonJS and published as a local package. |
| `ArchVR.Files` | Sample models (`duplex.glb`, `press.glb`) for trying things out. |

## Architecture

`ArchVR.App` serves both the front end and the back end. The API is tRPC, with Prisma as the ORM over SQL Server. Zod validates tRPC input, and the same schemas validate forms through Vee Validate. Authentication is handled by Auth.js, with email and password or GitHub sign-in. Uploaded files go to Azure Blob Storage.

The 3D editor lives in its own package so the BabylonJS dependencies stay out of the Nuxt application. The app imports it through the `~archvr3d` alias, which means it has to be built first.

The node graph editor is built on Rete and sits inside the Nuxt application, because it uses Vue as its rendering engine. Charts are drawn with ECharts.

## Getting started

You'll need Node.js, npm and Docker.

### 1. Build the 3D editor

```bash
cd ArchVR.3D
npm install
npm run build
```

### 2. Install the app

```bash
cd ArchVR.App
npm install
cp .env.example .env
```

Fill in `.env`. The app validates it on start-up and won't run with required values missing. The GitHub values are optional and only needed for GitHub sign-in. The SendGrid values are used for password reset emails.

### 3. Start the services

```bash
docker compose up -d
```

This starts SQL Server and Azurite, a local stand-in for Azure Blob Storage. SQL Server has no arm64 image, so on Apple Silicon it runs under emulation and takes a little longer to start.

### 4. Set up the database

```bash
npm run prisma:migrate
npm run prisma:seed
```

The seed adds the widget types and a handful of example devices.

### 5. Run it

```bash
npm run dev
```

The app is served at `http://localhost:3000`.

### 6. Try it out

1. Register an account and sign in.
2. Upload the sample models from `ArchVR.Files`.
3. Create a project, then a scene.
4. Add a model to the scene.
5. Add a widget, open its node graph, and connect a device to it.

## Working on the 3D editor

`ArchVR.3D` has its own dev server if you want to work on it in isolation:

```bash
cd ArchVR.3D
npm run dev
```

Rebuild it with `npm run build` for changes to show up in the app.

## Project context

`PRODUCT.md` describes who the product is for, what it does today and what's still undecided. Read it before making design or product decisions.
