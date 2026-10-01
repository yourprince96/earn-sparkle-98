import { SiFacebook, SiGmail, SiInstagram, SiTelegram, SiWhatsapp } from "react-icons/si";
import { Coins, Globe, Star } from "lucide-react";

const BRANDS: Record<string, { Icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  gmail: { Icon: SiGmail, cls: "bg-rose/15 text-rose" },
  facebook: { Icon: SiFacebook, cls: "bg-violet/15 text-violet" },
  whatsapp: { Icon: SiWhatsapp, cls: "bg-mint/15 text-mint-deep" },
  telegram: { Icon: SiTelegram, cls: "bg-violet/15 text-violet" },
  instagram: { Icon: SiInstagram, cls: "bg-rose/15 text-rose" },
  website: { Icon: Globe, cls: "bg-violet/15 text-violet" },
};

const COINS: Record<string, string> = { neva: "NV", ns: "NS", coinsta: "CS" };

export function BrandIcon({ icon, category }: { icon: string; category: string }) {
  if (COINS[icon]) {
    return (
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber/25 font-display text-sm font-bold text-amber-deep">
        {COINS[icon]}
      </span>
    );
  }
  const b =
    BRANDS[icon] ??
    (category === "website_visit"
      ? BRANDS.website
      : category === "coin_sale"
        ? { Icon: Coins, cls: "bg-amber/25 text-amber-deep" }
        : { Icon: Star, cls: "bg-mint/15 text-mint-deep" });
  const { Icon, cls } = b!;
  return (
    <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${cls}`}>
      <Icon className="size-6" />
    </span>
  );
}
