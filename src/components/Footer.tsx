import { Send } from "lucide-react";

const FOOTER_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDaablFYSvEUJYC0E-DQF5SMMJxA-slOpNgFW6YUVf833yYmbJ9BVbBme4J2roS9kad7oL_Bi-EzGw5Oz41PEzN4Xn0UEjH9-d1Ym3Hk8o0kofZl4O2DUHjtJGa4Fd-oRF2xUS4y_YjCABx2PvxfRmMVQ22gQCs4oAu6GzLejADdd1tBreL3w-aqKh7ogxOfgxwAFy39P-ofqDoFlrFMqAxqcBo4eibeafxASJebqfHoM5CeyaLu_GuqiHvLPicncO_ZNHwaqoleMK1";

const companyLinks = ["About Us", "Careers", "Press", "Contact"];
const resourceLinks = ["Help Center", "Creator Stories", "Creator Blog", "Pricing"];

export default function Footer() {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <img alt="Plezyy Logo" className="h-8 w-auto mb-6 dark:invert" src={FOOTER_LOGO} />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The world's first freelance adult marketplace. Buy and sell virtual intimate experiences safely and privately.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a className="hover:text-primary transition-colors" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a className="hover:text-primary transition-colors" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest from Plezyy creators.</p>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-secondary border-none rounded-xl text-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Email"
                type="email"
              />
              <button className="p-2 bg-primary text-primary-foreground rounded-xl">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2024 Plezyy Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
