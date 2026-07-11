import {
  AtSign,
  Briefcase,
  Code2,
  Gauge,
  Globe,
  Layout,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Plug,
  Search,
  Server,
  Shield,
  ShoppingBag,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  layout: Layout,
  "shopping-bag": ShoppingBag,
  gauge: Gauge,
  plug: Plug,
  zap: Zap,
  smartphone: Smartphone,
  search: Search,
  server: Server,
  "message-square": MessageSquare,
  "map-pin": MapPin,
  "messages-square": MessagesSquare,
  shield: Shield,
  "life-buoy": LifeBuoy,
  briefcase: Briefcase,
  linkedin: AtSign,
  github: Code2,
  email: Mail,
  whatsapp: MessageCircle,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Globe;
}
