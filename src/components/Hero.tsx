import { ArcGalleryHero } from "@/components/ui/arc-gallery-hero-component";

import heroImg1 from "@/assets/home-hero-pics/Gemini_Generated_Image_b4z5vyb4z5vyb4z5.png";
import heroImg2 from "@/assets/home-hero-pics/Gemini_Generated_Image_bfdhwebfdhwebfdh.png";
import heroImg3 from "@/assets/home-hero-pics/Gemini_Generated_Image_gtj0uygtj0uygtj0.png";
import heroImg4 from "@/assets/home-hero-pics/Gemini_Generated_Image_hmpux8hmpux8hmpu.png";
import heroImg5 from "@/assets/home-hero-pics/Gemini_Generated_Image_lxpjvclxpjvclxpj.png";
import heroImg6 from "@/assets/home-hero-pics/Gemini_Generated_Image_my91wmy91wmy91wm.png";
import heroImg7 from "@/assets/home-hero-pics/Gemini_Generated_Image_xf03d4xf03d4xf03.png";
import heroImg8 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 3.46.51 PM.png";
import heroImg9 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 3.48.25 PM (1).png";
import heroImg10 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 3.57.05 PM.png";
import heroImg11 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 4.19.49 PM (1).png";
import heroImg12 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 4.23.24 PM.png";
import heroImg13 from "@/assets/home-hero-pics/unnamed (1) (1).jpg";
import heroImg14 from "@/assets/home-hero-pics/unnamed (3) (1).jpg";

const influencerImages = [
  heroImg1,
  heroImg2,
  heroImg3,
  heroImg4,
  heroImg5,
  heroImg6,
  heroImg7,
  heroImg8,
  heroImg9,
  heroImg10,
  heroImg11,
  heroImg12,
  heroImg13,
  heroImg14,
];

export default function Hero() {
  return (
    <div className="w-full">
      <ArcGalleryHero images={influencerImages} />
    </div>
  );
}
