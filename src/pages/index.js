import Head from "next/head";

import LandingPage from "../components/website/landing/LandingPage";

export default function PublicLandingPage() {
  return (
    <>
      <Head>
        <title>3plug Platform | Modular Business Apps for Operations, Management & Administration</title>
        <meta
          name="description"
          content="3plug is a modular platform for business operations, management, and administration with selective app bundles, industry packs, and cloud or local deployment options."
        />
      </Head>
      <LandingPage />
    </>
  );
}
