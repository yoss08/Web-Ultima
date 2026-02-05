import { useState, useEffect } from "react";
import { Navigation } from "../../components/Navigation";
import { SummaHero } from "../../components/summa/SummaHero";
import { KeyMetrics } from "../../components/summa/KeyMetrics";
import { WhatIsSumma } from "../../components/summa/WhatIsSumma";
import { CoreFeatures } from "../../components/summa/CoreFeatures";
import { HowItWorks } from "../../components/summa/HowItWorks";
import { InterfacesPlatforms } from "../../components/summa/InterfacesPlatforms";
import { WhyChooseSumma } from "../../components/summa/WhyChooseSumma";
import { WhereSummaFits } from "../../components/summa/WhereSummaFits";
import { UltimaEcosystem } from "../../components/summa/UltimaEcosystem";
import { FinalCTA } from "../../components/summa/FinalCTA";
import { Footer } from "../../components/Footer";

export function SummaPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-black dark:bg-white transition-colors duration-300">
      <Navigation isDark={isDark} setIsDark={setIsDark} />
      <SummaHero />
      <KeyMetrics />
      <WhatIsSumma />
      <CoreFeatures />
      <HowItWorks />
      <InterfacesPlatforms />
      <WhyChooseSumma />
      <WhereSummaFits />
      <UltimaEcosystem />
      <FinalCTA />
      <Footer />
    </div>
  );
}