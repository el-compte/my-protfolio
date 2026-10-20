# Aymen Tlili · Portfolio

Personal site: full-stack engineer and team lead (TypeScript, NestJS, Next.js, AI).

A single static page (HTML, CSS and a little JavaScript for the light/dark switch and the
contact form). To preview locally:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321. Locally the contact form opens your email app instead of
sending, because the Web3Forms key is only added at deploy time.

## Deploy

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site into `dist/` with the contact-form key and deploys it to Vercel.
It can also be run by hand from the Actions tab.

It reads these repository secrets (Settings → Secrets and variables → Actions):

| Secret | Where to find it |
| --- | --- |
| `WEB3FORMS_ACCESS_KEY` | The access key from Web3Forms, with its dashes |
| `VERCEL_TOKEN` | Create one at https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel → your team's Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel → the project's Settings → General → Project ID |

`vercel.json` turns off Vercel's own Git deployments, so each push deploys once, through
the workflow.
