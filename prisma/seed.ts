import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.submission.deleteMany();

  // Seed sample submissions
  const submissions = [
    {
      name: "Nguyễn Văn An",
      phone: "0901234567",
      email: "an.nguyen@gmail.com",
      goal: "study",
      level: "A1",
      contacted: true,
      note: "Đã tư vấn, quan tâm khóa A1-A2",
    },
    {
      name: "Trần Thị Bình",
      phone: "0912345678",
      email: "binh.tran@gmail.com",
      goal: "ausbildung",
      level: "A2",
      contacted: true,
      note: "Đăng ký khóa B1, bắt đầu tháng 5",
    },
    {
      name: "Lê Hoàng Cường",
      phone: "0923456789",
      email: "cuong.le@yahoo.com",
      goal: "work",
      level: "B1",
      contacted: false,
      note: "",
    },
    {
      name: "Phạm Minh Dương",
      phone: "0934567890",
      email: "duong.pham@outlook.com",
      goal: "study",
      level: "",
      contacted: false,
      note: "",
    },
    {
      name: "Võ Thị Em",
      phone: "0945678901",
      email: "",
      goal: "personal",
      level: "A1",
      contacted: true,
      note: "Học vì sở thích, linh hoạt thời gian",
    },
    {
      name: "Hoàng Đức Phú",
      phone: "0956789012",
      email: "phu.hoang@gmail.com",
      goal: "migration",
      level: "B2",
      contacted: false,
      note: "",
    },
    {
      name: "Đặng Thị Giang",
      phone: "0967890123",
      email: "giang.dang@gmail.com",
      goal: "study",
      level: "A2",
      contacted: true,
      note: "Đã đóng học phí A2, hỏi thêm về visa",
    },
    {
      name: "Bùi Quang Hải",
      phone: "0978901234",
      email: "",
      goal: "ausbildung",
      level: "",
      contacted: false,
      note: "",
    },
  ];

  for (const sub of submissions) {
    await prisma.submission.create({ data: sub });
  }

  console.log(`Seeded ${submissions.length} submissions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
