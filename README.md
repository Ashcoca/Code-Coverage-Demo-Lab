# Checkout Coverage Demo Lab

This project is tiny demo shop that fails CI **on purpose**! The pipeline blocks anything below **80% coverage**. Your mission, should you choose to accept it: write tests until the coverage gate goes **green**.

Please **FORK** this repo to begin your work. Enable Actions if prompted to get the CI pipeline working.

If you get stuck, there is a solutions branch, but don't just copy and paste! Use it to give yourself a boost, but try to write the code yourself!

## Quick Start

```bash
npm install
npm run test:coverage   # fails on purpose: 70.4% coverage vs the 80% requirement
npm run mutate          # mutation testing: 63.4% — 26 X-Men slip past
npm run dev             # view the shop itself, at http://localhost:5173
```

## The Pipeline

`.github/workflows/ci.yml` runs four jobs on every push and pull request:

1. **Build** — `npm ci` + `vite build`, uploads the Pages artifact.
2. **Unit tests** — `npm test`.
3. **Coverage Gate** — `npm run test:coverage`; Vitest enforces the
   thresholds from `vitest.config.js` and exits when they are not
   met, which fails the job and blocks the deploy. A summary table lands in
   the job summary and the HTML report is attached as an artifact.
4. **Deploy** — publishes to GitHub Pages, `main` pushes only, and only
   after all three jobs above pass.

## Mutation testing

Code Coverage says which lines your tests *execute*. Mutation testing finds which
bugs your tests *notice*. `npm run mutate` (we're using StrykerJS, which uses the same
Vitest suite that's already set up). It then plants one bug at a time in `src/lib/checkout.js` What sort of bugs are we talking? flipped comparisons, swapped operators, broken strings, etc. It then counts how many the suite kills. The HTML report lands in `reports/mutation/mutation.html`

Copy `tests/weak-assertions.example.js` over the starter suite and the gate goes green while mutation testing calls the suite what it is. Coverage is a floor, not a ceiling, and a mutation score is the counterweight.

To gate CI on it, add `"thresholds": { "break": 80 }` to `stryker.conf.json`

**NOTE:** though mutation runs cost seconds here and minutes in real projects, most
teams run them nightly or on PRs to `main`, not every push.

## Pages

To enable Pages on your fork go to: repo **Settings → Pages → Source: GitHub Actions**. That's it! You're set.

Every push to `main` builds, tests, gates coverage, and deploys. Pull
requests run the first three jobs.

To see your deployed site (after you've passed the coverage gate) go to `[your-user-name].github.io/checkout-coverage-lab/`