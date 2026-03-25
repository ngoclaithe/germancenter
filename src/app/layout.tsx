import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://germancenter.edu.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "German Center | Trung Tâm Tiếng Đức Hàng Đầu - Học từ A1 đến C1",
    template: "%s | German Center",
  },
  description:
    "Trung tâm đào tạo tiếng Đức hàng đầu Việt Nam. Khóa học từ A1 đến C1, giáo viên bản ngữ Đức, tỷ lệ đậu 95%. Chuẩn bị du học, làm việc, Ausbildung tại Đức. Đăng ký tư vấn miễn phí!",
  keywords: [
    "học tiếng Đức",
    "tiếng Đức A1", "tiếng Đức A2", "tiếng Đức B1", "tiếng Đức B2", "tiếng Đức C1",
    "du học Đức",
    "Goethe Zertifikat",
    "trung tâm tiếng Đức",
    "khóa học tiếng Đức",
    "luyện thi tiếng Đức",
    "Ausbildung Đức",
    "TestDaF",
    "học tiếng Đức online",
    "giáo viên bản ngữ Đức",
    "German Center",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "German Center | Trung Tâm Tiếng Đức Hàng Đầu Việt Nam",
    description: "Khóa học tiếng Đức chất lượng cao, giáo viên bản ngữ, tỷ lệ đậu 95%. Từ A1 đến C1. Đăng ký tư vấn miễn phí!",
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "German Center",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "German Center - Trung Tâm Tiếng Đức",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "German Center | Học Tiếng Đức từ A1 đến C1",
    description: "Trung tâm đào tạo tiếng Đức hàng đầu Việt Nam. Giáo viên bản ngữ, tỷ lệ đậu 95%.",
    images: ["/images/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization"],
      "@id": `${SITE_URL}/#organization`,
      name: "German Center",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.webp`,
      description: "Trung tâm đào tạo tiếng Đức hàng đầu Việt Nam",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["vi", "de"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "German Center",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "vi",
    },
    {
      "@type": "Course",
      name: "Khóa học tiếng Đức A1-C1",
      description: "Khóa học tiếng Đức từ cơ bản đến nâng cao, giáo viên bản ngữ Đức.",
      provider: { "@id": `${SITE_URL}/#organization` },
      educationalLevel: "Beginner to Advanced",
      inLanguage: "de",
      availableLanguage: "vi",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Học tiếng Đức mất bao lâu để đạt B1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Với lộ trình tại German Center, bạn có thể đạt trình độ B1 sau khoảng 6-8 tháng học tập chuyên sâu.",
          },
        },
        {
          "@type": "Question",
          name: "German Center có giáo viên bản ngữ không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có, German Center có đội ngũ 5+ giáo viên bản ngữ Đức có chứng chỉ DaF, kết hợp giảng viên Việt Nam giàu kinh nghiệm.",
          },
        },
        {
          "@type": "Question",
          name: "Tỷ lệ đậu chứng chỉ tại German Center là bao nhiêu?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tỷ lệ đậu chứng chỉ Goethe và TestDaF của học viên German Center đạt trên 95%.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
