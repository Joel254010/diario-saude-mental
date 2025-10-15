// types/lucide-react.d.ts
declare module "lucide-react" {
  import { FC, SVGProps } from "react";

  export interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
  }

  // 🌟 Ícones principais usados no projeto
  export const ArrowLeft: FC<IconProps>;
  export const Utensils: FC<IconProps>;
  export const Coffee: FC<IconProps>;
  export const Soup: FC<IconProps>;
  export const Sandwich: FC<IconProps>;
  export const Save: FC<IconProps>;
  export const BookOpen: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Heart: FC<IconProps>;
  export const Target: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const Droplet: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const Smile: FC<IconProps>;
  export const Frown: FC<IconProps>;
  export const SmilePlus: FC<IconProps>;
  export const Meh: FC<IconProps>;
  export const Moon: FC<IconProps>;
  export const SunMedium: FC<IconProps>;
  export const Flame: FC<IconProps>;
  export const Sparkles: FC<IconProps>;
  export const Cloud: FC<IconProps>;

  // ✅ Ícones usados no SettingsPanel
  export const UserCircle: FC<IconProps>;
  export const BellRing: FC<IconProps>;
  export const Trash: FC<IconProps>;

  // ✅ Ícones usados no Challenges.tsx
  export const CheckCircle: FC<IconProps>;
  export const Leaf: FC<IconProps>;

  // ✅ Adicionados para Auth.tsx (campo de senha)
  export const Eye: FC<IconProps>;
  export const EyeOff: FC<IconProps>;
}
