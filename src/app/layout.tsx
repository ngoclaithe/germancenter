import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trung Tâm Tiếng Đức | Học Tiếng Đức từ A1 đến C1 tại Việt Nam",
  description:
    "Trung tâm đào tạo tiếng Đức hàng đầu Việt Nam. Khóa học từ A1 đến C1, giáo viên bản ngữ, tỷ lệ đậu 95%. Chuẩn bị du học, làm việc tại Đức. Đăng ký tư vấn miễn phí ngay!",
  keywords: [
    "học tiếng Đức",
    "tiếng Đức A1",
    "tiếng Đức B1",
    "du học Đức",
    "Goethe Zertifikat",
    "trung tâm tiếng Đức",
    "khóa học tiếng Đức",
    "luyện thi tiếng Đức",
  ],
  openGraph: {
    title: "Trung Tâm Tiếng Đức | Học Tiếng Đức từ A1 đến C1",
    description:
      "Khóa học tiếng Đức chất lượng cao, giáo viên bản ngữ, tỷ lệ đậu 95%. Đăng ký ngay!",
    type: "website",
    locale: "vi_VN",
    siteName: "Trung Tâm Tiếng Đức",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
