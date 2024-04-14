# TDVP

Hi Matt and Dan 👋

Full Repo

Built with TRPC, Next Auth, Vee Validate, Zod, Prisma, BabylonJs. ReteJs, ECharts and ❤️

Full setup instructions are provided in ArchVR.App

## Principles

There is a main Nuxt application which is responsible for the front and back ends.

Back end is provided by TRPC, with Prisma as an ORM. TRPC input is validated by Zod, which can also be used to validate form input for Vee Validate.

The 3D Editor is completely seperated from the main application to ensure a clean seperation of concern and to not pollute the Nuxt application with all the babylonJS dependencies.

The Rete (Node Graph) Editor needs to be inside the Nuxt application as it relies on using Vue as it's rendering engine. It may be desirable in the future to seperate this in the future for better code re-use.

It's late and I can't write any more I'm tired. Give me a shout if you need something.
