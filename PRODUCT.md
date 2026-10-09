# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Manufacturing engineers building digital twins of production cells and machines, so they can watch live production data in the context of the physical layout. (Confirmed by Martin, 2026-10-09.)

Not yet established: whether a separate view-only audience (operators, managers) consumes finished scenes, and how technical the engineers are assumed to be.

## Product Purpose

A browser-based digital-twin editor. An engineer uploads 3D models, composes them into scenes, places devices in the scene, and binds live device telemetry to both the 3D objects and to dashboard widgets overlaid on the scene.

Status: dormant work being revived. Name and direction are open (see Brand Commitments). What success means for the revived product has not been defined.

## Positioning

Node graph data binding: devices are wired to 3D transforms and widgets visually, in a node graph, without writing code. (Confirmed by Martin as the mechanism future work should treat as distinguishing.)

## Operating Context

Workflow as implemented (from `ArchVR.App/README.md` and the data model):

1. Upload model files to an organisation's file library.
2. Create a project, then a scene inside it. Scenes can nest under a parent scene.
3. Add models to the scene and position them.
4. Place project devices in the scene.
5. Add widgets and wire devices to widgets or object transforms in the node graph.

Devices belong to a project and are identified by hierarchical topics, e.g. `UK.SHF.BLD.Cell1.MA1.spindle` (site, building, cell, machine, signal). Seeded device types: temperature, position, power, vector.

## Capabilities and Constraints

Confirmed by the code:

- Organisations, users, projects, and role/permission enums at organisation and project level.
- Auth: credentials and GitHub sign-in, registration, password reset by email.
- File library per organisation, stored in Azure Blob Storage. Sample models are GLB (`ArchVR.Files/duplex.glb`, `press.glb`).
- 3D scene editor with explorer, object panel, property panel, and tools. IFC property sets, groups, and material layer sets are displayed for model objects.
- Node graph editor with nodes: device input, scale/offset, vector combiner, transform output, widget output. One graph per widget; graphs can also target a 3D transform.
- Widget types: KPI, Line (chart), Blank. Widgets have a stored position and size on the scene.
- Device data is currently faked in the editor (`deviceFaker.ts`); no real broker connection exists.

Architecture constraints (from the root README):

- `ArchVR.App` is a Nuxt 3 app (tRPC, Prisma, Zod, Vee Validate, Tailwind with daisyUI) serving front and back end.
- `ArchVR.3D` is a separate BabylonJS package, kept out of the Nuxt app deliberately. It must be built before the app runs.
- The node graph editor (Rete) lives inside the Nuxt app because it renders with Vue.

Terminology in use: organisation, project, scene, file, device, topic, widget, graph, transform.

Undecided or unbuilt:

- How real telemetry arrives. A schema comment suggests projects connecting to different brokers; nothing is implemented.
- The public landing page is a placeholder (`<h1>Hello</h1>`).
- VR, despite the repo name: no VR code was found.

## Brand Commitments

None binding. The repo and packages say ArchVR; the README says TDVP. Martin has said naming is open. Do not treat either name, or the current daisyUI theme, as a commitment.

## Evidence on Hand

- Two sample models: `ArchVR.Files/duplex.glb`, `ArchVR.Files/press.glb`.
- Seed data for widget types and five example devices: `ArchVR.App/prisma/seed.mjs`.

No customers, testimonials, case studies, benchmarks, pricing, or live deployments are on record. Future work must not invent them.

## Product Principles

Derived by Claude from the confirmed answers; not yet reviewed by Martin.

1. The binding is the product. The path from a device to a moving object or a live number should be the shortest, clearest thing in the editor.
2. No code required. Anything an engineer must do to connect data should be possible in the graph.
3. Data in spatial context. Telemetry is shown where it happens on the machine or cell, not in a separate dashboard.
4. Speak the plant's language. Use the engineer's own terms (cell, machine, signal, topic) over 3D-tooling jargon.
