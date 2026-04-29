import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type { SiteContent } from "@/types/site-content";

const CONTENT_FILE = join(process.cwd(), "data", "site-content.json");

const DEFAULT_CONTENT: SiteContent = {
  updatedAt: new Date().toISOString(),
  sections: [
    { id: "hero", label: "Hero", enabled: true, order: 1 },
    { id: "social-proof", label: "Social Proof", enabled: true, order: 2 },
    { id: "about", label: "About", enabled: true, order: 3 },
    { id: "target-audience", label: "Đối tượng", enabled: true, order: 4 },
    { id: "learning-roadmap", label: "Lộ trình", enabled: true, order: 5 },
    { id: "courses", label: "Khóa học", enabled: true, order: 6 },
    { id: "teaching-method", label: "Phương pháp", enabled: true, order: 7 },
    { id: "teachers", label: "Giảng viên", enabled: true, order: 8 },
    { id: "testimonials", label: "Cảm nhận", enabled: true, order: 9 },
    { id: "media", label: "Media", enabled: true, order: 10 },
    { id: "registration", label: "Đăng ký", enabled: true, order: 11 },
    { id: "cta", label: "CTA", enabled: true, order: 12 },
    { id: "ai-grading", label: "AI Grading", enabled: true, order: 13 },
  ],
  hero: {
    badgeText: "Được tin tưởng bởi 3000+ học viên tại Việt Nam",
    title: "Học tiếng Đức",
    highlightedTitle: "từ A1 đến C1",
    description:
      "Chinh phục tiếng Đức và mở ra cơ hội du học, làm việc tại Đức. Giáo viên chuyên nghiệp, phương pháp đã được chứng minh, kết quả thực tế.",
    primaryButtonText: "Đăng ký ngay",
    secondaryButtonText: "Kiểm tra trình độ miễn phí",
    imageSrc: "/images/hero-classroom.webp",
    imageAlt: "Học viên đang học tiếng Đức trong lớp học hiện đại",
  },
  about: {
    badgeText: "Về Lingua German",
    heading: "Lingua German",
    subheading: "Trung tâm đào tạo tiếng Đức hàng đầu Việt Nam",
    highlights: [
      "Giáo viên bản ngữ và Việt Nam giàu kinh nghiệm, chứng nhận quốc tế.",
      "Giáo trình chuẩn CEFR từ A1 đến C1, thiết kế riêng cho học viên Việt Nam.",
      "Lớp học nhỏ tối đa 10 học viên, đảm bảo luyện nói nhiều.",
      "Tỷ lệ đậu chứng chỉ Goethe, TestDaF đạt 95% — cam kết đầu ra.",
      "Lịch học linh hoạt: sáng, tối, cuối tuần phù hợp mọi lịch trình.",
      "Hỗ trợ tư vấn du học, visa và định hướng nghề nghiệp tại Đức.",
    ],
    imageSrc: "/images/student-hero.webp",
    imageAlt: "Học viên Lingua German",
  },
};

function mergeWithDefaults(content: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_CONTENT,
    ...content,
    hero: {
      ...DEFAULT_CONTENT.hero,
      ...(content.hero ?? {}),
    },
    about: {
      ...DEFAULT_CONTENT.about,
      ...(content.about ?? {}),
    },
    sections: Array.isArray(content.sections) && content.sections.length
      ? content.sections
      : DEFAULT_CONTENT.sections,
    updatedAt: content.updatedAt ?? DEFAULT_CONTENT.updatedAt,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (!existsSync(CONTENT_FILE)) {
      await saveSiteContent(DEFAULT_CONTENT);
      return DEFAULT_CONTENT;
    }
    const raw = await readFile(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return mergeWithDefaults(parsed);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}
