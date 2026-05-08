const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
    Header, Footer, PageNumber, LevelFormat, ImageRun
} = require('docx');
const fs = require('fs');

// ── Palette — Green theme ──────────────────────
const C = {
    primary: "1A5C38",   // deep green
    accent: "27AE60",   // green
    light: "D5F5E3",   // mint bg
    rowAlt: "EAFAF1",
    white: "FFFFFF",
    text: "1C1C1C",
    muted: "666666",
    border: "A9DFBF",
    totalBg: "1A5C38",
    totalFg: "FFFFFF",
};

const cm = { top: 90, bottom: 90, left: 140, right: 140 };
const bdr = (c = C.border) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const bdrs = (c = C.border) => ({ top: bdr(c), bottom: bdr(c), left: bdr(c), right: bdr(c) });

function run(text, opts = {}) {
    return new TextRun({ text, font: "Arial", size: 19, color: C.text, ...opts });
}

function para(children, opts = {}) {
    return new Paragraph({ spacing: { before: 60, after: 60 }, children, ...opts });
}

function spacer(before = 160) {
    return new Paragraph({ spacing: { before, after: 0 }, children: [] });
}

function divider() {
    return new Paragraph({
        spacing: { before: 80, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 1 } },
        children: []
    });
}

function sectionHead(num, title) {
    return new Paragraph({
        spacing: { before: 320, after: 120 },
        shading: { fill: C.primary, type: ShadingType.CLEAR },
        children: [run(`  ${num}. ${title.toUpperCase()}  `, { bold: true, color: C.white, size: 22 })]
    });
}

function infoRow(key, val, i) {
    return new TableRow({
        children: [
            new TableCell({
                borders: bdrs(), margins: cm,
                width: { size: 2800, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? C.light : "E8F8F0", type: ShadingType.CLEAR },
                children: [para([run(key, { bold: true, color: C.primary })])]
            }),
            new TableCell({
                borders: bdrs(), margins: cm,
                width: { size: 6560, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? C.white : C.rowAlt, type: ShadingType.CLEAR },
                children: [para([run(val)])]
            }),
        ]
    });
}

function infoTable(rows) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: rows.map((r, i) => infoRow(r[0], r[1], i))
    });
}

function dataTable(headers, colWidths, rows, totalRow = false) {
    const tableRows = [
        new TableRow({
            tableHeader: true,
            children: headers.map((h, i) => new TableCell({
                borders: bdrs(C.primary), margins: cm,
                width: { size: colWidths[i], type: WidthType.DXA },
                shading: { fill: C.primary, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run(h, { bold: true, color: C.white })] })]
            }))
        })
    ];

    rows.forEach((row, ri) => {
        const isTotal = totalRow && ri === rows.length - 1;
        tableRows.push(new TableRow({
            children: row.map((cell, ci) => {
                const { text, align = "LEFT", bold = false } = typeof cell === "string" ? { text: cell } : cell;
                const aVal = align === "RIGHT" ? AlignmentType.RIGHT : align === "CENTER" ? AlignmentType.CENTER : AlignmentType.LEFT;
                return new TableCell({
                    borders: bdrs(),
                    margins: cm,
                    width: { size: colWidths[ci], type: WidthType.DXA },
                    shading: { fill: isTotal ? C.totalBg : ri % 2 === 0 ? C.white : C.rowAlt, type: ShadingType.CLEAR },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({ alignment: aVal, children: [run(text, { bold: isTotal || bold, color: isTotal ? C.white : C.text })] })]
                });
            })
        }));
    });
    return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: colWidths, rows: tableRows });
}

function bullet(text) {
    return new Paragraph({
        spacing: { before: 60, after: 60 },
        numbering: { reference: "bullets", level: 0 },
        children: [run(text)]
    });
}

// ── DOCUMENT ───────────────────────────────────────────────────

let qrImageParagraph = spacer(10);
if (fs.existsSync('./QR_7M.png')) {
    qrImageParagraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [
            new ImageRun({
                data: fs.readFileSync('./QR_7M.png'),
                transformation: { width: 300, height: 300 },
                type: 'png'
            })
        ]
    });
} else {
    qrImageParagraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [run("(Vui lòng đính kèm ảnh QR tại đây)", { italic: true, color: C.muted })]
    });
}

const doc = new Document({
    numbering: {
        config: [{
            reference: "bullets",
            levels: [{
                level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 560, hanging: 280 } } }
            }]
        }]
    },
    sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 1 } },
                        spacing: { before: 0, after: 80 },
                        children: [run("BÁO GIÁ THIẾT KẾ WEBSITE TRUNG TÂM TIẾNG ĐỨC  |  DOSU Co., Ltd", { size: 16, color: C.muted })]
                    })
                ]
            })
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 1 } },
                        spacing: { before: 80, after: 0 },
                        children: [
                            run("Hiệu lực: 30 ngày  |  0346 437 915  |  Newli5737@gmail.com  |  Trang ", { size: 16, color: C.muted }),
                            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.muted, font: "Arial" }),
                        ]
                    })
                ]
            })
        },
        children: [
            // ── TIÊU ĐỀ ─────────────────────────────────────────────
            new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { before: 200, after: 60 },
                children: [run("BÁO GIÁ DỊCH VỤ THIẾT KẾ WEBSITE", { bold: true, size: 36, color: C.primary })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
                children: [run("Website Trung Tâm Tiếng Đức (Lingua German) — Next.js", { bold: true, size: 25, color: C.accent })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
                children: [run("Ngày lập: 02/05/2026  │  Hiệu lực báo giá: 30 ngày", { size: 18, color: C.muted })]
            }),
            divider(),
            spacer(160),

            para([run("Kính gửi: Quý Trung tâm (Lĩnh vực Giáo dục/Đào tạo Ngoại ngữ)", { size: 20, bold: true, color: C.primary })], { spacing: { before: 0, after: 80 } }),
            para([run("Chúng tôi trân trọng gửi đề xuất thiết kế website giáo dục chuyên nghiệp, xây dựng trên nền tảng Next.js 14, Tailwind CSS, đảm bảo tối ưu SEO, hiệu năng cực cao. Website mang phong cách giao diện hiện đại, tích hợp các tính năng nổi bật như Trí tuệ nhân tạo (AI) chấm bài trực tuyến miễn phí, hệ thống đăng ký khóa học, cùng trang quản trị nội dung (CMS) mạnh mẽ để quản lý học viên, khóa học, và phương tiện truyền thông.")], { spacing: { before: 0, after: 160 } }),

            infoTable([
                ["Hình thức thanh toán", "Thanh toán 100% trước khi triển khai hệ thống (theo phương án lựa chọn)"],
                ["Thời gian thực hiện", "~2 tuần (14 ngày làm việc)"],
                ["Nền tảng", "Next.js 14 (React), PostgreSQL, Prisma, Tailwind CSS"],
                ["Tính năng nổi bật", "Tích hợp AI chấm bài, Quản lý Leads, CMS nội dung động"],
                ["Bảo hành", "3 tháng sau bàn giao — lỗi kỹ thuật lập trình, không thu phí"],
            ]),

            spacer(300),

            // ── 1. TỔNG QUAN ────────────────────────────────────────
            sectionHead("1", "Tổng quan website"),
            spacer(80),
            para([run("Website được thiết kế mang phong cách hiện đại, sử dụng tông màu xanh thân thiện, các hiệu ứng cuộn mượt mà (framer-motion). Đặc biệt hỗ trợ cấu trúc dữ liệu JSON-LD cho mục đích giáo dục, chuẩn SEO tối đa giúp thu hút học viên.")], { spacing: { before: 80, after: 120 } }),

            dataTable(
                ["Trang / Module", "Nội dung"],
                [3000, 6360],
                [
                    ["Landing Page (Trang chủ)", "Tối ưu hóa chuyển đổi, hiển thị lộ trình học, giáo viên, học viên tiêu biểu, tính năng AI chấm bài, Form đăng ký."],
                    ["Trang Chi tiết Khóa Học", "Hiển thị thông tin khóa A1-C1, mức giá, thời lượng, số buổi học, tiện ích, lộ trình. Nút CTA liên hệ đăng ký rõ ràng."],
                    ["Tính năng AI Chấm Bài", "Người dùng nhập văn bản tiếng Đức -> AI đánh giá ngữ pháp, từ vựng và cho điểm. Miễn phí 1 lần/ngày."],
                    ["Quản trị Nội dung (CMS)", "Quản lý ảnh (Media), Banner, Nội dung khóa học, Giáo viên, Lộ trình, Lời chứng thực học viên (Testimonials)."],
                    ["Quản lý Đăng ký (Leads)", "Theo dõi form đăng ký: Họ tên, SĐT, Email, Trình độ mục tiêu. Cập nhật trạng thái 'Đã liên hệ' để chăm sóc."],
                ]
            ),

            spacer(300),

            // ── 2. CHỨC NĂNG CHI TIẾT ───────────────────────────────
            sectionHead("2", "Bảng kê chi tiết chức năng"),
            spacer(80),
            dataTable(
                ["#", "Hạng mục", "Chi tiết"],
                [420, 2680, 6260],
                [
                    ["1", "Giao diện (Frontend)", "Sử dụng Next.js 14, Tailwind CSS. Animation khi cuộn (AnimateOnScroll). Responsive chuẩn mọi thiết bị."],
                    ["2", "Dynamic Sections", "Trang chủ được cấu tạo từ các phần khối linh hoạt, có thể Bật/Tắt hiển thị và thay đổi thứ tự từ Admin CMS."],
                    ["3", "Module Khóa học", "Thiết kế thẻ khóa học 3D đẹp mắt (Stack cards carousel), trang chi tiết hiển thị giá, thời lượng, nội dung."],
                    ["4", "AI Chấm bài (Gemini)", "Tích hợp Google Generative AI chấm văn bản tiếng Đức. Giới hạn tỷ lệ truy cập qua LocalStorage. Format markdown đẹp.\n\nChi phí API (Khách hàng tự chi trả theo thực tế sử dụng):\n- Gemini 2.5 Flash: ~$0.30 / 1M input tokens, ~$2.50 / 1M output tokens\n- Gemini 3 Flash: ~$0.50 / 1M input, ~$3.00 / 1M output\n- Trung bình ~ $0.002 – $0.004 / request (prompt ~500, output ~1000 tokens)\n* Không tính theo request cố định → phụ thuộc độ dài nội dung."],
                    ["5", "Module Giáo viên", "Danh sách giáo viên bản ngữ/Việt Nam. Carousel trượt xem các nhận xét (Feedback) từ học viên đã thi đỗ."],
                    ["6", "Admin - Leads", "Hệ thống nhận form đăng ký. Bảng quản lý Leads, tìm kiếm, đánh dấu đã chăm sóc, xóa/chỉnh sửa thông tin."],
                    ["7", "Admin - Media", "Quản lý thư viện hình ảnh, upload/xóa hình ảnh để sử dụng làm banner, ảnh giáo viên, ảnh khóa học trong CMS."],
                    ["8", "Admin - Content", "Giao diện chỉnh sửa trực quan (Form base) cho các nội dung trang chủ (Thay text, đổi ảnh, tùy chỉnh cấu trúc)."],
                    ["9", "Bảo mật", "Đăng nhập Admin an toàn. API routes được bảo vệ phân quyền. Cơ sở dữ liệu PostgreSQL + Prisma ORM."],
                    ["10", "SEO & Analytics", "Dynamic JSON-LD cho EducationalOrganization và Course. Thẻ meta, Open Graph, Sitemap.xml tự động cập nhật."],
                    ["11", "Tối ưu hiệu năng", "Tối ưu hình ảnh tự động (Next/Image), nén file tĩnh, tốc độ tải siêu tốc. Tối đa hóa điểm Core Web Vitals."],
                    ["12", "Triển khai (Deploy)", "Deploy hệ thống trên VPS. Cấu hình Nginx reverse proxy, PM2 process manager, chứng chỉ bảo mật SSL (HTTPS)."],
                ]
            ),

            spacer(300),

            // ── 3. BẢNG GIÁ & PHƯƠNG ÁN TRIỂN KHAI ───────────────────
            sectionHead("3", "Bảng giá chi tiết & Phương án triển khai"),
            spacer(80),
            para([run("Chi tiết hạng mục phần mềm", { bold: true, size: 21, color: C.primary })], { spacing: { before: 0, after: 80 } }),
            dataTable(
                ["STT", "Hạng mục", "Ghi chú"],
                [420, 5000, 3940],
                [
                    [{ text: "1" }, { text: "Thiết kế & Lập trình UI/UX (Next.js/Tailwind)" }, { text: "Giao diện animation đẹp, responsive" }],
                    [{ text: "2" }, { text: "Tích hợp chức năng AI chấm bài trực tuyến" }, { text: "Prompt chuẩn, cấu hình kết nối" }],
                    [{ text: "3" }, { text: "Trang quản trị CMS & Hệ thống quản lý (Leads)" }, { text: "Quản lý nội dung, Database an toàn" }],
                    [{ text: "4" }, { text: "Cấu hình triển khai hạ tầng & Bảo mật" }, { text: "Cài đặt VPS, Domain, SSL" }],
                ]
            ),
            spacer(160),
            para([run("Các phương án triển khai & Vận hành", { bold: true, size: 21, color: C.primary })], { spacing: { before: 0, after: 80 } }),
            dataTable(
                ["Phương án", "Chi tiết dịch vụ", "Tổng trọn gói (VNĐ)"],
                [1800, 5260, 2300],
                [
                    ["Phương án 1\n(DOSU quản lý)", "Bao gồm phần mềm + Tên miền & VPS (Sử dụng hạ tầng bên DOSU trong 1 năm đầu).", "6.000.000"],
                    ["Phương án 2\n(Khách hàng quản lý)", "Bao gồm phần mềm + Triển khai lên VPS và chuyển giao toàn quyền quản lý Tên miền & VPS sang tài khoản của khách hàng.", "7.000.000"],
                ]
            ),
            spacer(80),
            para([run("★  Đã bao gồm bản quyền website vĩnh viễn và toàn bộ source code. Quý trung tâm vui lòng chọn 1 trong 2 phương án triển khai trên.", { size: 18, color: C.muted })]),

            spacer(300),

            // ── 4. LỘ TRÌNH ─────────────────────────────────────────
            sectionHead("4", "Lộ trình triển khai (~2 tuần)"),
            spacer(80),
            dataTable(
                ["Giai đoạn", "Nội dung công việc", "Thời gian"],
                [1600, 5960, 1800],
                [
                    ["Tuần 1", "Khảo sát yêu cầu, thống nhất thiết kế; Dựng project Next.js, xây dựng Header, Footer, Landing Page các khối nội dung (Hero, Khóa học); Hoàn thiện trang chi tiết khóa học.", "Ngày 1 – 7"],
                    ["Tuần 2", "Tích hợp AI chấm bài; Kết nối PostgreSQL, xây dựng CMS Admin (Leads, Media, Content), cấu hình SEO; Nhận thanh toán -> Deploy VPS, cấu hình Nginx/SSL, Domain (theo phương án đã chọn); Bàn giao.", "Ngày 8 – 14"],
                ]
            ),

            spacer(300),

            // ── 5. THANH TOÁN & BẢO HÀNH ────────────────────────────
            sectionHead("5", "Điều khoản thanh toán & bảo hành"),
            spacer(80),
            para([run("Lịch thanh toán", { bold: true, size: 21, color: C.primary })], { spacing: { before: 0, after: 100 } }),
            dataTable(
                ["Đợt", "Tỷ lệ", "Số tiền (VNĐ)", "Thời điểm"],
                [1200, 1400, 2600, 4160],
                [
                    ["Thanh toán", "100%", "6.000.000 hoặc 7.000.000\n(Tùy phương án)", "Thanh toán 1 lần toàn bộ giá trị theo phương án đã chọn trước khi bắt đầu deploy hệ thống."],
                ],
                true
            ),
            spacer(160),
            para([run("Bảo hành & Hỗ trợ", { bold: true, size: 21, color: C.primary })], { spacing: { before: 0, after: 80 } }),
            bullet("Bảo hành 3 tháng sau bàn giao: xử lý lỗi kỹ thuật do lập trình hoàn toàn miễn phí"),
            bullet("Hỗ trợ kỹ thuật qua Zalo / điện thoại trong giờ hành chính"),
            bullet("Hỗ trợ cập nhật các yêu cầu nâng cấp, tính năng mới: báo giá ưu đãi riêng"),
            spacer(80),
            para([run("Quyền sở hữu & Bản quyền", { bold: true, size: 21, color: C.primary })], { spacing: { before: 0, after: 80 } }),
            bullet("Bản quyền website trọn đời — không thu phí thuê bao duy trì hệ thống hàng năm"),
            bullet("Bàn giao đầy đủ mã nguồn (source code) cùng hướng dẫn cài đặt và vận hành"),
            bullet("Hệ thống thuộc quyền sở hữu hoàn toàn của Quý trung tâm sau khi hoàn tất thanh toán"),

            spacer(300),

            // ── 6. LIÊN HỆ & CHUYỂN KHOẢN ──────────────────────────────────────────
            sectionHead("6", "Thông tin liên hệ & Hướng dẫn thanh toán"),
            spacer(80),
            infoTable([
                ["Đơn vị thực hiện", "CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU"],
                ["Người phụ trách", "Lại Thế Ngọc"],
                ["Điện thoại / Zalo", "0346 437 915"],
                ["Email", "Newli5737@gmail.com"],
                ["Website", "https://dosutech.site"],
                ["Địa chỉ", "Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội"],
                ["Lưu ý quan trọng", "Nếu chọn Phương án 2: Bao giờ thanh toán xong thì gửi tài khoản Vietnix để triển khai trên VPS và chuyển giao tên miền về tài khoản."],
            ]),

            spacer(80),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [run("Vui lòng quét mã QR dưới đây để tiến hành thanh toán:", { bold: true, color: C.primary })]
            }),
            qrImageParagraph,

            spacer(240),
            divider(),
            spacer(120),
            new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
                children: [run("Trân trọng cảm ơn Quý trung tâm đã tin tưởng và lựa chọn dịch vụ của chúng tôi.", { bold: true, size: 20, color: C.primary })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [run("Chúng tôi cam kết bàn giao sản phẩm đúng tiến độ, đúng thiết kế, với chất lượng tốt nhất.", { size: 19, color: C.muted })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { before: 80, after: 0 },
                children: [run("— DOSU Co., Ltd —", { bold: true, size: 20, color: C.accent })]
            }),
        ]
    }]
});

Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync('./BAO_GIA_TRUNG_TAM_TIENG_DUC.docx', buf);
    console.log('Báo giá đã được tạo thành công: BAO_GIA_TRUNG_TAM_TIENG_DUC.docx');
});