
import CTASection from "@/components/CTASection";
import Preventive from "@/components/Preventive";
import Solution from "@/components/Solution";
import Banner from "@/shared/Banner";
import Feature from "@/components/Features/Feature";
import PublicVoice from "@/components/publicVoices/PublicVoice";
import FeaturesSection from "@/shared/FeaturesSection";



export default function Home() {
  return (
      <div>
      <Banner/>
      <FeaturesSection/>
      <Solution/>
      <Feature/>
      <PublicVoice/>
     <Preventive/>
     <CTASection/>
     </div>
  );
}


