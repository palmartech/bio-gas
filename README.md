# BiogasFit

A mobile-friendly, Nigeria-first concept prototype for a possible collaboration with Solution Giver Constructions. It helps a homeowner or compound manager prepare for a professional biogas site survey and shows how an installer might manage structured enquiries.

This is an **independent pitch demo**. It is not affiliated with the provider, does not collect contact details, and does not send survey requests or enquiries anywhere. All new records and status changes remain in the current browser's `localStorage`. Dashboard examples are fictional.

## Run locally

Requires Node.js 22.6 or newer. The test command uses Node's built-in TypeScript type stripping.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Use `/assessment` for the buyer journey and `/dashboard` for the partner view.

## Publish a free preview

The repository is set up for a public GitHub Pages project site at `https://USERNAME.github.io/bio-gas/`. After pushing to a public repository named `bio-gas`, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Each push to `main` then runs the checks and publishes the static export.

The shared preview is an independent concept demo. It has no backend: each visitor sees the fictional examples and their own browser-local assessments. The simulated survey request sends nothing to a business.

Verification:

```powershell
npm test
npm run typecheck
npm run build
```

## What the prototype does

1. Explains cooking and electricity as **possible uses**, with site-specific review emphasized.
2. Collects broad Nigerian location, property details, existing sanitation, possible organic inputs, space, energy goal, and a monthly spend band. A respondent can answer “I don’t know” to technical questions.
3. Uses a deterministic assessment function to create one of three **enquiry routes**: ready to discuss a survey, more information needed, or specialist review needed. Electricity requests and proposed changes to existing sanitation always receive a specialist flag. These routes do **not** determine feasibility.
4. Creates a browser-local brief. A survey request button marks that record as a **simulation**. The dashboard displays seeded and new briefs, allows pipeline-status changes, and copies a concise brief to the clipboard.

The app intentionally makes no gas-yield, cost-savings, generator-runtime, system-suitability, or direct soakaway-conversion claim.

## Partnership and pilot gates

Before any live release, obtain the provider's approval to use its name, logo, or media; confirm its service area, site survey criteria, system configurations, installation and maintenance workflow, prices, verified case results, and support process. Have qualified biogas and electrical practitioners approve customer-facing technical statements and review applicable Nigerian requirements.

Test the prototype with five potential household or compound buyers on phones and one installer. Observe completion without help, whether buyers understand the result is preliminary, and whether the installer can identify the next survey questions from each brief. A later live pilot would require authenticated staff access, explicit lead consent, secure storage, and a real survey-booking channel.

## Source context

- [Cooking gas and electricity reel](https://www.instagram.com/reel/Dd_tx-ZqbUL/)
- [Generator reel](https://www.instagram.com/reel/DdjsP88qF9A/)
- [EPA: septic systems](https://www.epa.gov/septic/how-septic-systems-work)
- [EPA: biogas basics and safety](https://www.epa.gov/anaerobic-digestion/frequent-questions-about-anaerobic-digestion)
- [EPA: biogas operator guide](https://www.epa.gov/agstar/anaerobic-digesterbiogas-system-operator-guidebook)

The reel captions and visible demonstrations motivated the concept; they are not installation specifications or verified performance data.
