# ArchVR.3D

3D Editor for ArchVR.

Built as a seperate project to ensure proper separations of concerns.

```bash
npm i
npm run build
```

you can also run a dev server if you're into that kind of thing to work on the 3d bits

```bash
npm run dev
```

# Vite Vanilla Library Template

Template for creating a library with a fully customized environment.

## Features

- ✨ Fully customized [eslint](https://eslint.org/) configuration based on the config by [Antfu](https://github.com/antfu/eslint-config)
- 🧪 Write tests quickly and conveniently with [vitest](https://vitest.dev/)
- 🤝 Supports [conventional commits](https://www.conventionalcommits.org/)
- 💅 Generate beautiful changelogs with [changelogen](https://github.com/unjs/changelogen)
- ♾️ GitHub CI for your build
- 🤖 Ready configuration for [renovatebot](https://github.com/apps/renovate) with [renovate-config](https://github.com/hywax/renovate-config)
- 🚀 Library releases with just one command

## Get started

### GitHub Template

This is a template repo. Click the green [Use this template](https://github.com/hywax/vite-vanilla-library-template/generate) button to get started.

### Git Clone

```shell
git clone https://github.com/hywax/vite-vanilla-library-template.git
cd vite-vanilla-library-template
pnpm install
```

## Usage

The template contains the following scripts:

- `dev` - Start the development server
- `build` - Build for production
- `release` - Generate changelog and npm publish
- `lint` - Checks your code for any linting errors
- `test` - Run all tests
- `test:watch` - Run all tests with watch mode
- `test:coverage` - Run all tests with code coverage report
- `prepare` - Script for setting up husky hooks

## License

This template was created under the [MIT License](LICENSE).
