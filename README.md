# Adoptium.net (Next.js)

[![Netlify Status](https://api.netlify.com/api/v1/badges/17e64afa-e88c-45da-9367-db893a423b6f/deploy-status)](https://app.netlify.com/projects/adoptium-next/deploys)
[![codecov](https://codecov.io/gh/adoptium/adoptium.net-next/branch/main/graph/badge.svg?token=XGJMJVT8BA)](https://codecov.io/gh/adoptium/adoptium.net-next) [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/adoptium/adoptium.net-next/badge)](https://api.securityscorecards.dev/projects/github.com/adoptium/adoptium.net-next)

This repository contains the source code of the [adoptium.net](https://adoptium.net) site (written in Next.js).

## Getting Started

First, install dependencies and run the development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying files in the `src/app` directory. The pages auto-update as you edit the files.

## Project Structure

This project uses:

- [Next.js](https://nextjs.org) App Router
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization
- TypeScript for type safety
- [next-intl](./locales/README.md) from i18n
- CSS Modules for styling

## Contributing

Contributions to the Adoptium site are welcome! Please follow the contribution guidelines in the repository.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deployment

The site is deployed according to the Adoptium project's infrastructure requirements.

For more information about deploying Next.js applications:

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
