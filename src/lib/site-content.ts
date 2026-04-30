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
    { id: "ausbildung", label: "Du học nghề", enabled: true, order: 11 },
    { id: "registration", label: "Đăng ký", enabled: true, order: 12 },
    { id: "cta", label: "CTA", enabled: true, order: 13 },
    { id: "ai-grading", label: "AI Grading", enabled: true, order: 14 },
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
    floatStudentsLabel: "Học viên",
    floatStudentsValue: "2.000+",
    floatEnrollmentLabel: "Đang tuyển sinh",
    floatEnrollmentValue: "Khóa T4/2026",
    floatPassRateLabel: "Tỷ lệ đậu",
    floatPassRateValue: "95%",
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
  targetAudience: {
    title: "Dù bạn đang là",
    highlightedTitle: "ai...",
    description: "Lingua German đồng hành cùng mọi đối tượng trên con đường chinh phục tiếng Đức.",
    items: [
      {
        image: "/images/doituong/designer.webp",
        title: "Người đi làm",
        description: "Nâng cao cơ hội nghề nghiệp, làm việc tại các công ty Đức hoặc đối tác châu Âu.",
      },
      {
        image: "/images/doituong/student.webp",
        title: "Học sinh, Sinh viên",
        description: "Chuẩn bị du học Đức, thi chứng chỉ Goethe, TestDaF — mở cánh cửa tương lai.",
      },
      {
        image: "/images/doituong/marketer.webp",
        title: "Chuyên viên",
        description: "Giao tiếp chuyên nghiệp với đối tác Đức, tạo lợi thế cạnh tranh trong công việc.",
      },
      {
        image: "/images/doituong/owner2.webp",
        title: "Chủ doanh nghiệp",
        description: "Mở rộng thị trường, hợp tác kinh doanh với Đức — nền kinh tế lớn nhất EU.",
      },
    ],
  },
  registration: {
    badgeText: "Bắt đầu ngay",
    title: "Bắt đầu",
    highlightedTitle: "hành trình tiếng Đức",
    description: "Điền thông tin bên dưới, chúng tôi sẽ liên hệ bạn trong 24 giờ",
    submitButtonText: "Đăng ký ngay - Nhận tư vấn miễn phí",
  },
  cta: {
    badgeText: "Ưu đãi có hạn",
    title: "Sẵn sàng bắt đầu hành trình tiếng Đức?",
    description: "Tham gia cùng 3000+ học viên thành công. Giảm 20% khi đăng ký trong tháng này. Miễn phí kiểm tra trình độ và buổi học thử!",
    primaryButtonText: "Nhận ưu đãi ngay",
    secondaryButtonText: "Đặt lịch tư vấn miễn phí",
    urgencyText: "Chỉ còn 5 suất cho đợt tuyển sinh tháng này",
  },
  socialProof: {
    headingText: "Chỉ bằng một trung tâm duy nhất",
    brandText: "LINGUA GERMAN",
  },
  learningRoadmap: {
    badgeText: "Hành trình học tập",
    title: "Lộ trình",
    highlightedTitle: "từng bước",
    description: "Từ con số 0 đến thành thạo - lộ trình được thiết kế riêng cho học viên Việt Nam",
    finishText: "Thành thạo tiếng Đức!",
    levels: [
      { level: "A1", title: "Sơ cấp", duration: "3 tháng", emoji: "🌱", description: "Giao tiếp cơ bản, chào hỏi, tình huống hàng ngày", skills: ["Giới thiệu bản thân", "Gọi món ăn", "Hỏi đường"], rotate: "rotate-[-2deg]" },
      { level: "A2", title: "Cơ bản", duration: "3 tháng", emoji: "📚", description: "Trao đổi đơn giản, gia đình, mua sắm, công việc", skills: ["Sinh hoạt hàng ngày", "Mua sắm", "Du lịch cơ bản"], rotate: "rotate-[2deg]" },
      { level: "B1", title: "Trung cấp", duration: "4 tháng", emoji: "🚀", description: "Nắm ý chính, du lịch tự tin, viết văn bản đơn giản", skills: ["Bày tỏ ý kiến", "Xử lý tình huống", "Mô tả trải nghiệm"], rotate: "rotate-[-3deg]" },
      { level: "B2", title: "Trung cấp cao", duration: "4 tháng", emoji: "🎯", description: "Văn bản phức tạp, giao tiếp trôi chảy, viết chi tiết", skills: ["Thảo luận chuyên ngành", "Chủ đề trừu tượng", "Đọc báo"], rotate: "rotate-[2deg]" },
      { level: "C1", title: "Cao cấp", duration: "5 tháng", emoji: "🎓", description: "Ngôn ngữ phức tạp, sử dụng linh hoạt, chuyên nghiệp", skills: ["Giao tiếp chuyên nghiệp", "Viết học thuật", "Lập luận phức tạp"], rotate: "rotate-[-2deg]" },
    ],
  },
  courses: {
    badgeText: "Chương trình học",
    title: "Chọn",
    highlightedTitle: "khóa học phù hợp",
    description: "Chương trình linh hoạt, phù hợp với lịch trình và mục tiêu học tập của bạn",
    items: [
      { level: "A1", title: "Tiếng Đức Sơ Cấp", description: "Hoàn hảo cho người mới bắt đầu. Nói tiếng Đức từ ngày đầu tiên.", duration: "3 tháng", lessons: "48 buổi học", price: "4.500.000", popular: false, image: "/images/courses/a1.webp", features: ["Bài tập tương tác", "Luyện nói", "Giáo viên bản ngữ", "Chứng chỉ hoàn thành"] },
      { level: "A2", title: "Tiếng Đức Cơ Bản", description: "Tự tin giao tiếp hàng ngày và nắm vững ngữ pháp cơ bản.", duration: "3 tháng", lessons: "48 buổi học", price: "4.500.000", popular: false, image: "/images/courses/a1.webp", features: ["Tình huống thực tế", "Mở rộng từ vựng", "Văn hóa Đức", "Theo dõi tiến độ"] },
      { level: "B1", title: "Tiếng Đức Trung Cấp", description: "Tự tin diễn đạt về các chủ đề quen thuộc và tình huống thường gặp.", duration: "4 tháng", lessons: "64 buổi học", price: "6.000.000", popular: true, image: "/images/courses/b1.webp", features: ["Luyện thi chuyên sâu", "Ngữ pháp nâng cao", "Kỹ năng viết", "Chuẩn bị du học"] },
      { level: "B2", title: "Tiếng Đức Trung Cấp Cao", description: "Chinh phục chủ đề phức tạp và chuẩn bị nhập học đại học.", duration: "4 tháng", lessons: "64 buổi học", price: "6.500.000", popular: false, image: "/images/courses/c1.webp", features: ["Chuẩn bị đại học", "Tiếng Đức chuyên ngành", "Sẵn sàng TestDaF", "Viết học thuật"] },
      { level: "C1", title: "Tiếng Đức Cao Cấp", description: "Thành thạo tiếng Đức chuyên nghiệp, sẵn sàng cho công việc và học thuật.", duration: "5 tháng", lessons: "80 buổi học", price: "8.000.000", popular: false, image: "/images/courses/c1.webp", features: ["Tiếng Đức chuyên nghiệp", "Gần bản ngữ", "Phỏng vấn việc làm", "Hướng dẫn chuyên gia"] },
    ],
  },
  teachingMethod: {
    badgeText: "Phương pháp của chúng tôi",
    title: "Cách chúng tôi giúp bạn",
    highlightedTitle: "học dễ dàng hơn",
    description: "Phương pháp giảng dạy đã được chứng minh kết hợp sư phạm hiện đại với ứng dụng thực tế",
    methods: [
      { emoji: "🗣️", title: "Nói trước tiên", description: "Thực hành nói từ ngày đầu với hội thoại thực tế và đóng vai. 60% thời lượng lớp dành cho luyện nói.", size: "large", rotate: "rotate-[-1deg]", bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8" },
      { emoji: "👥", title: "Học tương tác", description: "Hoạt động nhóm hấp dẫn, trò chơi và dự án cộng tác.", size: "small", rotate: "rotate-[1deg]", bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8" },
      { emoji: "🎯", title: "Luyện thi thực tế", description: "Thi thử định kỳ theo format Goethe và TestDaF. Tỷ lệ đậu 95%.", size: "small", rotate: "rotate-[-2deg]", bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8" },
      { emoji: "⚡", title: "Phương pháp tăng tốc", description: "Kỹ thuật đã được chứng minh giúp học nhanh gấp 3 lần phương pháp truyền thống.", size: "small", rotate: "rotate-[2deg]", bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8" },
      { emoji: "🎧", title: "Phát âm chuẩn", description: "Luyện nghe với người bản ngữ để có giọng phát âm chính xác. Công nghệ AI nhận diện giọng nói.", size: "large", rotate: "rotate-[1deg]", bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8" },
      { emoji: "🇩🇪", title: "Hòa nhập văn hóa", description: "Học văn hóa, phong tục và cách ứng xử Đức song song với ngôn ngữ.", size: "small", rotate: "rotate-[-1deg]", bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8" },
    ],
    stats: [
      { value: "2 cấp độ", label: "Tiến bộ trung bình / năm", emoji: "📈" },
      { value: "60%", label: "Thời lượng lớp dành cho luyện nói", emoji: "🗣️" },
      { value: "4.9 / 5.0", label: "Độ hài lòng từ học viên", emoji: "⭐" },
    ],
  },
  teachers: {
    badgeText: "Đội ngũ giảng viên",
    title: "Chuyên gia",
    highlightedTitle: "đồng hành cùng bạn",
    items: [
      { name: "Thomas Müller", role: "Giảng viên chính", specialty: "Chuyên gia Goethe B2-C1", bio: "15 năm kinh nghiệm giảng dạy, từng giảng viên tại Goethe-Institut Hà Nội. Chuyên đào tạo học viên chinh phục các kỳ thi chứng chỉ quốc tế với tỷ lệ đậu 98%.", image: "/images/teachers/thomas.png", origin: "Đức", exp: "15 năm", students: "500+" },
      { name: "Nguyễn Thanh Hương", role: "Giảng viên cao cấp", specialty: "Phương pháp giao tiếp", bio: "Thạc sĩ Ngôn ngữ Đức tại ĐH Heidelberg, 10 năm giảng dạy tiếng Đức. Sáng tạo phương pháp học qua tình huống thực tế giúp học viên tự tin giao tiếp.", image: "/images/teachers/huong.png", origin: "Việt Nam", exp: "10 năm", students: "400+" },
      { name: "Stefan Weber", role: "Giảng viên bản ngữ", specialty: "Luyện phát âm & nghe", bio: "Giáo viên bản ngữ đến từ Berlin, chứng chỉ DaF, chuyên luyện thi TestDaF. Phong cách giảng dạy gần gũi và luôn tạo không khí lớp học sôi nổi.", image: "/images/teachers/stefan.png", origin: "Đức", exp: "8 năm", students: "350+" },
      { name: "Trần Minh Đức", role: "Giảng viên", specialty: "Ngữ pháp A1-B1", bio: "Tốt nghiệp ĐH Kỹ thuật Munich, đam mê truyền đạt ngữ pháp dễ hiểu. Là cầu nối giúp học viên Việt Nam tiếp cận ngữ pháp Đức một cách logic.", image: "/images/teachers/duc.png", origin: "Việt Nam", exp: "5 năm", students: "200+" },
    ],
    statItems: [{ value: "15+", label: "Giảng viên" }, { value: "100%", label: "Chứng chỉ DaF" }],
  },
  testimonials: {
    badgeText: "Câu chuyện thành công",
    title: "Học viên",
    highlightedTitle: "nói gì về chúng tôi",
    items: [
      { name: "Đỗ Minh Tuấn", role: "Trợ lý nghiên cứu", level: "Tốt nghiệp B2", image: "/images/hocvien/dominhtuan.webp", rating: 5, text: "Đầu tư tốt nhất của mình! Kiến thức văn hóa và mẹo thực tế từ giáo viên đã giúp mình thích nghi nhanh với cuộc sống tại Đức." },
      { name: "Lê Thị Mai", role: "Sinh viên ngành Điều dưỡng", level: "Tốt nghiệp B1", image: "/images/hocvien/lethimai.webp", rating: 5, text: "Lớp nhỏ và giáo viên kiên nhẫn đã giúp mình vượt qua nỗi sợ nói. Mình đã đậu thi B1 và giờ đang học điều dưỡng tại Đức!" },
      { name: "Nguyễn Minh Anh", role: "Sinh viên ĐH Kỹ thuật Munich", level: "Tốt nghiệp B2", image: "/images/hocvien/minhanh.webp", rating: 5, text: "Nhờ trung tâm, mình đã đậu kỳ thi B2 ngay lần đầu và được nhận vào ĐH Kỹ thuật Munich. Giáo viên rất tuyệt vời!" },
      { name: "Trần Văn Hùng", role: "Kỹ sư phần mềm tại Berlin", level: "Tốt nghiệp C1", image: "/images/hocvien/tranvanhung.webp", rating: 5, text: "Mình từ con số 0 lên C1 trong 18 tháng. Giờ mình làm việc tại công ty công nghệ ở Berlin. Thời gian luyện nói rất quý giá!" },
      { name: "Võ Thanh Hằng", role: "Thạc sĩ tại Hamburg", level: "Tốt nghiệp C1", image: "/images/hocvien/vothanhhang.webp", rating: 5, text: "Tài liệu luyện thi và bài thi thử rất sát đề thực. Mình hoàn toàn tự tin vào phòng thi TestDaF và đạt điểm cần thiết!" },
      { name: "Phạm Quốc Bảo", role: "Chương trình Ausbildung", level: "Tốt nghiệp A2", image: "/images/hocvien/phamquocbao.webp", rating: 5, text: "Chuẩn bị hoàn hảo cho chương trình Ausbildung. Giáo viên tập trung vào tiếng Đức thực tế sử dụng hàng ngày ở Đức." },
    ],
  },
  media: {
    badgeText: "Chứng nhận & Công nhận",
    title: "Được công nhận bởi",
    highlightedTitle: "tiêu chuẩn quốc tế",
    description: "Chứng chỉ của chúng tôi được công nhận bởi các trường đại học, đại sứ quán và nhà tuyển dụng Đức trên toàn thế giới.",
    mainImage: "/images/school-interior.webp",
    mainImageAlt: "Không gian học tập hiện đại",
    secondaryImage: "/images/graduation-ceremony.webp",
    secondaryImageAlt: "Lễ trao chứng chỉ và thành tích",
    certs: [
      { emoji: "🎓", title: "Đối tác Goethe-Institut", desc: "Trung tâm khảo thí chính thức, đề thi chuẩn quốc tế.", rotate: "rotate-[-2deg]", gradient: "from-[#FF2D78] to-[#E0255F]" },
      { emoji: "📜", title: "Chứng nhận telc", desc: "Trung tâm thi ủy quyền, chứng chỉ telc Deutsch A1-C1.", rotate: "rotate-[2deg]", gradient: "from-[#FF6B9D] to-[#D4206B]" },
      { emoji: "🌍", title: "Công nhận toàn cầu", desc: "Được 200+ trường đại học Đức và đại sứ quán chấp nhận.", rotate: "rotate-[-1deg]", gradient: "from-[#FF2D78] to-[#FF6B9D]" },
      { emoji: "🏅", title: "Tỷ lệ đậu 95%", desc: "Cam kết đầu ra với tỷ lệ đậu chứng chỉ cao nhất khu vực.", rotate: "rotate-[1.5deg]", gradient: "from-[#D4206B] to-[#FF2D78]" },
    ],
  },
  ausbildung: {
    badgeText: "Du học nghề Đức — Ausbildung",
    title: "Cánh cửa đến",
    highlightedTitle: "tương lai tại Đức",
    description: "Chương trình Ausbildung — đào tạo nghề kép tại Đức — giúp bạn vừa học vừa làm, được trả lương và có cơ hội định cư lâu dài tại nền kinh tế lớn nhất châu Âu.",
    heroImage: "/images/ausbildung/hero.png",
    heroImageAlt: "Học viên Việt Nam trong chương trình Ausbildung tại Đức",
    secondaryImage: "/images/ausbildung/workplace.png",
    secondaryImageAlt: "Môi trường làm việc hiện đại tại Đức",
    steps: [
      { number: "01", title: "Học tiếng Đức đạt B1/B2", description: "Hoàn thành khóa tiếng Đức từ A1 đến B1/B2 tại Lingua German với chứng chỉ Goethe được công nhận quốc tế." },
      { number: "02", title: "Tư vấn & chọn ngành nghề", description: "Đội ngũ tư vấn giúp bạn chọn ngành Ausbildung phù hợp: Điều dưỡng, Kỹ thuật, IT, Nhà hàng khách sạn, và nhiều hơn." },
      { number: "03", title: "Chuẩn bị hồ sơ & visa", description: "Hỗ trợ toàn bộ quy trình: hồ sơ ứng tuyển, thư xin việc bằng tiếng Đức, phỏng vấn, và xin visa Ausbildung." },
      { number: "04", title: "Bay sang Đức & bắt đầu", description: "Bắt đầu chương trình đào tạo 2-3.5 năm tại doanh nghiệp Đức, được trả lương từ 800-1.200€/tháng." },
    ],
    benefits: [
      { emoji: "💰", title: "Được trả lương", description: "Nhận lương 800-1.200€/tháng ngay từ khi bắt đầu Ausbildung." },
      { emoji: "🎓", title: "Bằng cấp quốc tế", description: "Bằng nghề Đức được công nhận toàn EU và nhiều quốc gia." },
      { emoji: "🏠", title: "Cơ hội định cư", description: "Sau Ausbildung, được cấp giấy phép lao động và lộ trình PR." },
      { emoji: "🛡️", title: "Bảo hiểm toàn diện", description: "Bảo hiểm y tế, tai nạn, hưu trí — đầy đủ quyền lợi như người Đức." },
    ],
    stats: [
      { value: "200+", label: "Học viên đã sang Đức" },
      { value: "95%", label: "Tỷ lệ đậu visa" },
      { value: "50+", label: "Ngành nghề đào tạo" },
      { value: "2-3.5 năm", label: "Thời gian Ausbildung" },
    ],
    ctaTitle: "Bắt đầu hành trình Ausbildung của bạn",
    ctaDescription: "Đăng ký tư vấn miễn phí để được đội ngũ chuyên gia đánh giá hồ sơ và tư vấn lộ trình phù hợp nhất.",
    ctaButtonText: "Đăng ký tư vấn miễn phí",
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
    targetAudience: {
      ...DEFAULT_CONTENT.targetAudience,
      ...(content.targetAudience ?? {}),
      items: Array.isArray(content.targetAudience?.items) && content.targetAudience.items.length
        ? content.targetAudience.items
        : DEFAULT_CONTENT.targetAudience.items,
    },
    registration: {
      ...DEFAULT_CONTENT.registration,
      ...(content.registration ?? {}),
    },
    cta: {
      ...DEFAULT_CONTENT.cta,
      ...(content.cta ?? {}),
    },
    socialProof: {
      ...DEFAULT_CONTENT.socialProof,
      ...(content.socialProof ?? {}),
    },
    learningRoadmap: {
      ...DEFAULT_CONTENT.learningRoadmap,
      ...(content.learningRoadmap ?? {}),
      levels: Array.isArray(content.learningRoadmap?.levels) && content.learningRoadmap.levels.length
        ? content.learningRoadmap.levels
        : DEFAULT_CONTENT.learningRoadmap.levels,
    },
    courses: {
      ...DEFAULT_CONTENT.courses,
      ...(content.courses ?? {}),
      items: Array.isArray(content.courses?.items) && content.courses.items.length
        ? content.courses.items
        : DEFAULT_CONTENT.courses.items,
    },
    teachingMethod: {
      ...DEFAULT_CONTENT.teachingMethod,
      ...(content.teachingMethod ?? {}),
      methods: Array.isArray(content.teachingMethod?.methods) && content.teachingMethod.methods.length
        ? content.teachingMethod.methods
        : DEFAULT_CONTENT.teachingMethod.methods,
      stats: Array.isArray(content.teachingMethod?.stats) && content.teachingMethod.stats.length
        ? content.teachingMethod.stats
        : DEFAULT_CONTENT.teachingMethod.stats,
    },
    teachers: {
      ...DEFAULT_CONTENT.teachers,
      ...(content.teachers ?? {}),
      items: Array.isArray(content.teachers?.items) && content.teachers.items.length
        ? content.teachers.items
        : DEFAULT_CONTENT.teachers.items,
      statItems: Array.isArray(content.teachers?.statItems) && content.teachers.statItems.length
        ? content.teachers.statItems
        : DEFAULT_CONTENT.teachers.statItems,
    },
    testimonials: {
      ...DEFAULT_CONTENT.testimonials,
      ...(content.testimonials ?? {}),
      items: Array.isArray(content.testimonials?.items) && content.testimonials.items.length
        ? content.testimonials.items
        : DEFAULT_CONTENT.testimonials.items,
    },
    media: {
      ...DEFAULT_CONTENT.media,
      ...(content.media ?? {}),
      certs: Array.isArray(content.media?.certs) && content.media.certs.length
        ? content.media.certs
        : DEFAULT_CONTENT.media.certs,
    },
    ausbildung: {
      ...DEFAULT_CONTENT.ausbildung,
      ...(content.ausbildung ?? {}),
      steps: Array.isArray(content.ausbildung?.steps) && content.ausbildung.steps.length
        ? content.ausbildung.steps
        : DEFAULT_CONTENT.ausbildung.steps,
      benefits: Array.isArray(content.ausbildung?.benefits) && content.ausbildung.benefits.length
        ? content.ausbildung.benefits
        : DEFAULT_CONTENT.ausbildung.benefits,
      stats: Array.isArray(content.ausbildung?.stats) && content.ausbildung.stats.length
        ? content.ausbildung.stats
        : DEFAULT_CONTENT.ausbildung.stats,
    },
    sections: (() => {
      if (!Array.isArray(content.sections) || !content.sections.length) {
        return DEFAULT_CONTENT.sections;
      }
      // Append any new default sections not present in saved data
      const savedIds = new Set(content.sections.map((s) => s.id));
      const newSections = DEFAULT_CONTENT.sections.filter((s) => !savedIds.has(s.id));
      if (newSections.length === 0) return content.sections;
      const maxOrder = Math.max(...content.sections.map((s) => s.order));
      return [
        ...content.sections,
        ...newSections.map((s, i) => ({ ...s, order: maxOrder + 1 + i })),
      ];
    })(),
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
