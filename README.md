# Task Management App

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/davlet61/task-management-app/blob/main/LICENSE)

A simple application to organize tasks with possibility of having several lists.

## Tech Stack

<p align="center">
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="36" height="36" alt="TypeScript" /></a>
<a href="https://nextjs.org/docs" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs.svg" width="36" height="36" alt="NextJs" /></a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="36" height="36" alt="React" /></a>
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="36" height="36" alt="TailwindCSS" /></a>
<a href="https://supabase.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg" width="36" height="36" alt="Supabase" /></a>
<a href="https://prisma.io/" target="_blank" rel="noreferrer"><img src="https://github.com/prisma/presskit/blob/main/Logos/Logomark-Default-Prisma.svg" width="36" height="36" alt="Prisma" /></a>
<a href="https://trpc.io/" target="_blank" rel="noreferrer"><img src="https://trpc.io/img/logo-no-text.svg" alt="tRPC" height="36"/></a>
</p>

## Demo

The application is live at the following address:

https://task-management-app-orcin.vercel.app/

You can also try it on sandbox:

_Note: You still need Environment Variables_

[![Edit focused-pine-yg50i9](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/focused-pine-yg50i9?fontsize=14&hidenavigation=1&theme=dark)

## Run Locally

Clone the project

```bash
  git clone https://github.com/davlet61/task-management-app.git
```

Go to the project directory

```bash
  cd task-management-app
```

Install dependencies

**_NOTE:_** The default package manager for this project is `pnpm`

*If you wish to use a different package manager make sure to **_remove_** the `preinstall` script from the `package.json`.*

```bash
  pnpm install
```

Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

`NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY`

Start dev server

```bash
  pnpm dev
```
