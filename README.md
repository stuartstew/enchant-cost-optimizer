<p align="center">
  <a href="https://stuartstew.github.io/enchant-cost-optimizer/">
    <img width="128" src="./public/icon.svg" alt="Enchantment Cost Optimizer">
  </a>
  <br />
  <h1 align="center">Enchantment Cost Optimizer</h1>
  <p align="center">A tool for Minecraft: Calculates the optimal order for combining enchantments on an anvil to save your XP.</p>
</p>

## Introduction

In **Minecraft**, you can combine enchantments on items using an anvil.
This operation consumes your XP,
and the cost **varies significantly** depending on the order in which you combine the items.
Each time you use an item in an anvil, its **prior work penalty** increases,
which is imposed for future operations.
Once the cost gets too high, the anvil refuses the operation and says "Too Expensive!".
This tool allows you to find the optimal order for combining enchantments to minimize XP cost.

> **Reference:** [Anvil mechanics – Minecraft Wiki](https://minecraft.wiki/w/Anvil_mechanics)

## How To Use

1. Pick an item.
2. Pick desired enchantments.
3. Press the "Calculate" button to see the optimal order.

> [!IMPORTANT]
> This tool assumes all item and books start with **zero anvil uses**.

## Development

### Prerequisites

- Node.js 24+
- pnpm 10+

### Setup

```bash
pnpm install
```

### Commands

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start development server           |
| `pnpm build`      | Build for production               |
| `pnpm preview`    | Preview production build           |
| `pnpm check`      | Run Biome formatter and linter     |
| `pnpm test`       | Run tests with Vitest              |
| `pnpm typecheck`  | Run TypeScript type checking       |

### Tech Stack

- **Framework:** React + Vite
- **UI Library:** Mantine
- **Language:** TypeScript
- **Formatter/Linter:** Biome
- **Testing:** Vitest + Testing Library

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Make your changes, then run the checks below before opening a PR.

```bash
pnpm check
pnpm typecheck
pnpm test
```

3. Open a pull request to `main`. CI will automatically run format/lint checks, type checking, and tests.

## Disclaimer

NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
