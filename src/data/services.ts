import type { ServiceItem } from "@/types";
import { defaultImageForServiceIcon } from "@/data/service-images";

export const services: ServiceItem[] = [
  {
    id: "business-website",
    title: "Business Website Development",
    outcome:
      "Launch a credible, conversion-ready website that presents your offer clearly and builds trust with prospective clients.",
    icon: "globe",
    image: defaultImageForServiceIcon("globe"),
  },
  {
    id: "custom-web-app",
    title: "Custom Web Application Development",
    outcome:
      "Replace fragmented tools with a tailored application that matches how your team actually works.",
    icon: "layout",
    image: defaultImageForServiceIcon("layout"),
  },
  {
    id: "ecommerce",
    title: "E-commerce Development",
    outcome:
      "Sell products or services online with secure checkout, catalogue management, and a smooth buying experience.",
    icon: "shopping-bag",
    image: defaultImageForServiceIcon("shopping-bag"),
  },
  {
    id: "admin-dashboard",
    title: "Admin Dashboard Development",
    outcome:
      "Give your team a clear control centre for users, content, reports, and day-to-day operations.",
    icon: "gauge",
    image: defaultImageForServiceIcon("gauge"),
  },
  {
    id: "api-integration",
    title: "API and Third-Party Integration",
    outcome:
      "Connect payments, CRMs, email tools, and other platforms so data moves reliably between systems.",
    icon: "plug",
    image: defaultImageForServiceIcon("plug"),
  },
  {
    id: "redesign-performance",
    title: "Website Redesign and Performance Improvement",
    outcome:
      "Modernise an outdated site, improve speed and usability, and strengthen the path from visit to enquiry.",
    icon: "zap",
    image: defaultImageForServiceIcon("zap"),
  },
  {
    id: "pwa-mobile",
    title: "PWA and Mobile-Friendly Application Development",
    outcome:
      "Deliver experiences that work well on phones and tablets without forcing users onto a separate native app.",
    icon: "smartphone",
    image: defaultImageForServiceIcon("smartphone"),
  },
  {
    id: "seo-ready",
    title: "SEO-Ready Website Development",
    outcome:
      "Build technical foundations that help search engines understand your pages and support long-term discovery.",
    icon: "search",
    image: defaultImageForServiceIcon("search"),
  },
  {
    id: "hosting-maintenance",
    title: "Hosting, Deployment, and Maintenance",
    outcome:
      "Keep your product online with practical deployment, monitoring-friendly setups, and ongoing technical support.",
    icon: "server",
    image: defaultImageForServiceIcon("server"),
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    outcome:
      "Get clear advice on architecture, scope, and delivery options before you invest in the wrong direction.",
    icon: "message-square",
    image: defaultImageForServiceIcon("message-square"),
  },
];
