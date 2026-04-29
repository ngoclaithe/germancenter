export interface HeroContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageSrc: string;
  imageAlt: string;
}

export interface AboutContent {
  badgeText: string;
  heading: string;
  subheading: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
}

export interface SiteSection {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface SiteContent {
  updatedAt: string;
  sections: SiteSection[];
  hero: HeroContent;
  about: AboutContent;
}
