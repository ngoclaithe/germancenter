export interface HeroContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageSrc: string;
  imageAlt: string;
  floatStudentsLabel: string;
  floatStudentsValue: string;
  floatEnrollmentLabel: string;
  floatEnrollmentValue: string;
  floatPassRateLabel: string;
  floatPassRateValue: string;
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

export interface AudienceItem {
  image: string;
  title: string;
  description: string;
}

export interface TargetAudienceContent {
  title: string;
  highlightedTitle: string;
  description: string;
  items: AudienceItem[];
}

export interface RegistrationContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  submitButtonText: string;
}

export interface CtaContent {
  badgeText: string;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  urgencyText: string;
}

export interface SocialProofContent {
  headingText: string;
  brandText: string;
}

export interface RoadmapLevelContent {
  level: string;
  title: string;
  duration: string;
  emoji: string;
  description: string;
  skills: string[];
  rotate: string;
}

export interface LearningRoadmapContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  levels: RoadmapLevelContent[];
  finishText: string;
}

export interface CourseItemContent {
  level: string;
  title: string;
  description: string;
  duration: string;
  lessons: string;
  price: string;
  originalPrice?: string;
  popular: boolean;
  image: string;
  features: string[];
  demoUrl?: string;
}

export interface CoursesContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  items: CourseItemContent[];
}

export interface TeachingMethodItemContent {
  emoji: string;
  title: string;
  description: string;
  size: string;
  rotate: string;
  bg: string;
}

export interface TeachingMethodStatContent {
  value: string;
  label: string;
  emoji: string;
}

export interface TeachingMethodContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  methods: TeachingMethodItemContent[];
  stats: TeachingMethodStatContent[];
}

export interface TeacherItemContent {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  origin: string;
  exp: string;
  students: string;
  profileUrl?: string;
}

export interface TeachersContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  items: TeacherItemContent[];
  statItems: { value: string; label: string }[];
}

export interface TestimonialItemContent {
  name: string;
  role: string;
  level: string;
  image: string;
  rating: number;
  text: string;
}

export interface TestimonialsContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  items: TestimonialItemContent[];
  feedbackUrl?: string;
  certificateUrl?: string;
}

export interface MediaCertItemContent {
  emoji: string;
  title: string;
  desc: string;
  rotate: string;
  gradient: string;
}

export interface MediaContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  mainImage: string;
  mainImageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  certs: MediaCertItemContent[];
}

export interface AusbildungStepContent {
  number: string;
  title: string;
  description: string;
}

export interface AusbildungBenefitContent {
  emoji: string;
  title: string;
  description: string;
}

export interface AusbildungStatContent {
  value: string;
  label: string;
}

export interface AusbildungContent {
  badgeText: string;
  title: string;
  highlightedTitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  steps: AusbildungStepContent[];
  benefits: AusbildungBenefitContent[];
  stats: AusbildungStatContent[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  successStoriesUrl?: string;
}

export interface SiteContent {
  updatedAt: string;
  sections: SiteSection[];
  hero: HeroContent;
  about: AboutContent;
  targetAudience: TargetAudienceContent;
  registration: RegistrationContent;
  cta: CtaContent;
  socialProof: SocialProofContent;
  learningRoadmap: LearningRoadmapContent;
  courses: CoursesContent;
  teachingMethod: TeachingMethodContent;
  teachers: TeachersContent;
  testimonials: TestimonialsContent;
  media: MediaContent;
  ausbildung: AusbildungContent;
}
