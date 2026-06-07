# Home Gym Tracker v2

Ficha de treino em casa que virou **jogo de saúde** — agora em React + TypeScript + Tailwind, instalável como app (PWA), com sincronização e notificações via Supabase.

> Reescrita do [home-gym-tracker](https://github.com/Tcordeir0/home-gym-tracker) (v1, vanilla) numa stack moderna: componentes isolados, tipos, temas ricos e animações fluidas.

## Stack

- **React 19 + TypeScript** — tipagem pega erros em tempo de build
- **Vite + vite-plugin-pwa** — build rápido, app instalável offline
- **Tailwind CSS 4** — sistema de temas em runtime (variáveis CSS)
- **Motion** — animações fluidas
- **Zustand** — estado global
- **Supabase** — auth, sincronização (`app_state`) e Web Push (`push_subs`)

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build de produção |
| `npm run typecheck` | Só checagem de tipos |
| `npm run lint` | ESLint |

## Deploy

Build estático publicado no GitHub Pages via GitHub Actions. Versionamento por
[release-please](https://github.com/googleapis/release-please) com
[Conventional Commits](https://www.conventionalcommits.org/).

---

Feito por **Talys Cordeiro** ([@Tcordeir0](https://github.com/Tcordeir0)).
