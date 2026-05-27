import { StudyDay, Category, SubTask } from './types';

const rawSchedule = [
  // Tuần 6
  {
    week: 6,
    dayOfWeek: "Thứ 4",
    dateString: "27/5",
    fullDate: "2026-05-27",
    content: "Lập kế hoạch học tập, ổn định sinh hoạt, setup góc học tập, ngủ đủ 8 tiếng"
  },
  {
    week: 6,
    dayOfWeek: "Thứ 5",
    dateString: "28/5",
    fullDate: "2026-05-28",
    content: "TOEIC Listening Part 1–2, shadowing, ôn React component/props/state, đọc lại source frontend"
  },
  {
    week: 6,
    dayOfWeek: "Thứ 6",
    dateString: "29/5",
    fullDate: "2026-05-29",
    content: "Nộp báo cáo E-learning tuần 6, review useState/useEffect/routing, debug lỗi nhỏ"
  },
  {
    week: 6,
    dayOfWeek: "Thứ 7",
    dateString: "30/5",
    fullDate: "2026-05-30",
    content: "Ôn backend ExpressJS, CRUD API, route/controller, Git/GitHub"
  },
  {
    week: 6,
    dayOfWeek: "Chủ nhật",
    dateString: "31/5",
    fullDate: "2026-05-31",
    content: "Tổng ôn frontend → backend → database, tự giải thích source code, debug và ghi note"
  },
  // Tuần 7
  {
    week: 7,
    dayOfWeek: "Thứ 2",
    dateString: "1/6",
    fullDate: "2026-06-01",
    content: "AWS foundation: Cloud computing, Region/AZ, IAM, User/Role/Policy"
  },
  {
    week: 7,
    dayOfWeek: "Thứ 3",
    dateString: "2/6",
    fullDate: "2026-06-02",
    content: "TOEIC Listening Part 3, từ vựng TOEIC, mini reading test"
  },
  {
    week: 7,
    dayOfWeek: "Thứ 4",
    dateString: "3/6",
    fullDate: "2026-06-03",
    content: "EC2, Public/Private IP, Security Group, SSH/RDP, vẽ sơ đồ EC2"
  },
  {
    week: 7,
    dayOfWeek: "Thứ 5",
    dateString: "4/6",
    fullDate: "2026-06-04",
    content: "TOEIC Reading Part 5–6, grammar tense/passive, mini test"
  },
  {
    week: 7,
    dayOfWeek: "Thứ 6",
    dateString: "5/6",
    fullDate: "2026-06-05",
    content: "Nộp báo cáo E-learning tuần 7, học S3, bucket, upload file, static hosting"
  },
  {
    week: 7,
    dayOfWeek: "Thứ 7",
    dateString: "6/6",
    fullDate: "2026-06-06",
    content: "RDS, SQL cơ bản, app kết nối database, database security"
  },
  {
    week: 7,
    dayOfWeek: "Chủ nhật",
    dateString: "7/6",
    fullDate: "2026-06-07",
    content: "Tổng ôn IAM, EC2, S3, RDS, tự vẽ sơ đồ cloud"
  },
  // Tuần 8
  {
    week: 8,
    dayOfWeek: "Thứ 2",
    dateString: "8/6",
    fullDate: "2026-06-08",
    content: "Prompt AI generate frontend, review source, chỉnh Tailwind/UI"
  },
  {
    week: 8,
    dayOfWeek: "Thứ 3",
    dateString: "9/6",
    fullDate: "2026-06-09",
    content: "TOEIC Listening Part 4, Reading Part 7, từ vựng TOEIC"
  },
  {
    week: 8,
    dayOfWeek: "Thứ 4",
    dateString: "10/6",
    fullDate: "2026-06-10",
    content: "Generate CRUD backend bằng AI, đọc controller/service, test API"
  },
  {
    week: 8,
    dayOfWeek: "Thứ 5",
    dateString: "11/6",
    fullDate: "2026-06-11",
    content: "TOEIC mini test, grammar review, nghe tiếng Anh IT"
  },
  {
    week: 8,
    dayOfWeek: "Thứ 6",
    dateString: "12/6",
    fullDate: "2026-06-12",
    content: "Nộp báo cáo E-learning tuần 8, upload ảnh lên S3, backend kết nối S3"
  },
  {
    week: 8,
    dayOfWeek: "Thứ 7",
    dateString: "13/6",
    fullDate: "2026-06-13",
    content: "JWT login/register, middleware auth, hash password"
  },
  {
    week: 8,
    dayOfWeek: "Chủ nhật",
    dateString: "14/6",
    fullDate: "2026-06-14",
    content: "Review source, fix bug, refactor nhẹ, push GitHub"
  },
  // Tuần 9
  {
    week: 9,
    dayOfWeek: "Thứ 2",
    dateString: "15/6",
    fullDate: "2026-06-15",
    content: "HTTPS, environment variable, SQL Injection, XSS/CSRF"
  },
  {
    week: 9,
    dayOfWeek: "Thứ 3",
    dateString: "16/6",
    fullDate: "2026-06-16",
    content: "TOEIC Reading tốc độ, listening dài, mini test"
  },
  {
    week: 9,
    dayOfWeek: "Thứ 4",
    dateString: "17/6",
    fullDate: "2026-06-17",
    content: "Gmail integration NodeJS, OTP verify, forgot password"
  },
  {
    week: 9,
    dayOfWeek: "Thứ 5",
    dateString: "18/6",
    fullDate: "2026-06-18",
    content: "TOEIC full/mini test, shadowing, vocabulary TOEIC"
  },
  {
    week: 9,
    dayOfWeek: "Thứ 6",
    dateString: "19/6",
    fullDate: "2026-06-19",
    content: "Nộp báo cáo E-learning tuần 9, CloudWatch, AWS Budget, SES"
  },
  {
    week: 9,
    dayOfWeek: "Thứ 7",
    dateString: "20/6",
    fullDate: "2026-06-20",
    content: "Deploy frontend/backend, environment variable, domain"
  },
  {
    week: 9,
    dayOfWeek: "Chủ nhật",
    dateString: "21/6",
    fullDate: "2026-06-21",
    content: "Review security, test project, fix deploy bug"
  },
  // Tuần 10
  {
    week: 10,
    dayOfWeek: "Thứ 2",
    dateString: "22/6",
    fullDate: "2026-06-22",
    content: "Chốt ý tưởng project, vẽ flow hệ thống, chia task"
  },
  {
    week: 10,
    dayOfWeek: "Thứ 3",
    dateString: "23/6",
    fullDate: "2026-06-23",
    content: "TOEIC full test, review lỗi sai, vocabulary"
  },
  {
    week: 10,
    dayOfWeek: "Thứ 4",
    dateString: "24/6",
    fullDate: "2026-06-24",
    content: "Build frontend hoàn chỉnh, responsive, API integration"
  },
  {
    week: 10,
    dayOfWeek: "Thứ 5",
    dateString: "25/6",
    fullDate: "2026-06-25",
    content: "TOEIC speaking/shadowing, listening practice"
  },
  {
    week: 10,
    dayOfWeek: "Thứ 6",
    dateString: "26/6",
    fullDate: "2026-06-26",
    content: "Nộp báo cáo E-learning tuần 10, backend hoàn chỉnh, auth/database"
  },
  {
    week: 10,
    dayOfWeek: "Thứ 7",
    dateString: "27/6",
    fullDate: "2026-06-27",
    content: "AWS deploy hoàn chỉnh, S3, monitoring, final deploy"
  },
  {
    week: 10,
    dayOfWeek: "Chủ nhật",
    dateString: "28/6",
    fullDate: "2026-06-28",
    content: "Test toàn bộ project, fix bug cuối, push GitHub, viết README"
  }
];

function getCategories(content: string): Category[] {
  const normalized = content.toLowerCase();
  const categories: Category[] = [];

  const toeicWords = ["toeic", "listening", "reading", "shadowing", "grammar", "vocabulary", "english", "tiếng anh", "speaking", "test"];
  const awsWords = ["aws", "cloud", "iam", "user", "role", "policy", "region", "az", "ec2", "ssh", "rdp", "s3", "bucket", "rds", "cloudwatch", "ses", "budget", "deploy"];
  const frontendWords = ["react", "component", "props", "state", "usestate", "useeffect", "routing", "tailwind", "ui", "frontend"];
  const backendWords = ["backend", "expressjs", "crud", "api", "route", "controller", "service", "jwt", "login", "register", "auth", "hash", "password", "security", "node", "verify", "otp", "gmail", "https", "xss", "csrf", "injection", "middleware"];
  const elearningWords = ["e-learning", "báo cáo"];
  const reviewWords = ["ôn", "review", "tổng ôn", "tự giải thích", "note", "sơ đồ", "fix bug", "refactor", "test", "lỗi"];
  const projectWords = ["project", "flow", "task", "chốt ý tưởng", "readme", "github", "git"];
  const lifeWords = ["sinh hoạt", "ngủ", "kế hoạch học tập", "setup góc", "học tập", "ổn định"];

  if (toeicWords.some(w => normalized.includes(w))) categories.push('TOEIC');
  if (awsWords.some(w => normalized.includes(w))) categories.push('AWS');
  if (frontendWords.some(w => normalized.includes(w))) categories.push('Frontend');
  if (backendWords.some(w => normalized.includes(w))) categories.push('Backend');
  if (elearningWords.some(w => normalized.includes(w))) categories.push('E-learning');
  if (reviewWords.some(w => normalized.includes(w))) categories.push('Review');
  if (projectWords.some(w => normalized.includes(w))) categories.push('Project');
  if (lifeWords.some(w => normalized.includes(w))) categories.push('Life');

  // Fallback
  if (categories.length === 0) categories.push('Life');

  return categories;
}

function parseSubtasks(id: string, content: string): SubTask[] {
  // Split on commas or arrows or semicolons
  const list = content.split(/,|;|→/);
  return list
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map((item, index) => ({
      id: `${id}-task-${index}`,
      text: item.charAt(0).toUpperCase() + item.slice(1),
      completed: false
    }));
}

export const getInitialSchedule = (): StudyDay[] => {
  return rawSchedule.map((item, index) => {
    const id = `week${item.week}-d${index + 1}`;
    const categories = getCategories(item.content);
    const tasks = parseSubtasks(id, item.content);
    return {
      id,
      week: item.week,
      dayOfWeek: item.dayOfWeek,
      dateString: item.dateString,
      fullDate: item.fullDate,
      originalContent: item.content,
      categories,
      tasks,
      notes: ""
    };
  });
};

export const categoryStyles: Record<Category, { bg: string; text: string; border: string; label: string }> = {
  TOEIC: {
    bg: 'bg-blue-50/70 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800/50',
    label: '🔈 TOEIC'
  },
  AWS: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
    label: '☁️ AWS'
  },
  Frontend: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    label: '⚛️ Frontend'
  },
  Backend: {
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800/50',
    label: '🟢 Backend'
  },
  'E-learning': {
    bg: 'bg-purple-50/70 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800/50',
    label: '📝 E-learning'
  },
  Project: {
    bg: 'bg-pink-50/70 dark:bg-pink-950/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800/50',
    label: '🚀 Project'
  },
  Review: {
    bg: 'bg-violet-50/70 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800/50',
    label: '🔍 Ôn Tập'
  },
  Life: {
    bg: 'bg-teal-50/70 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800/50',
    label: '🌱 Sinh Hoạt'
  }
};

export const motivationalQuotes = [
  "Bắt đầu từ việc nhỏ mỗi ngày, thành công lón sẽ tự khắc tìm đến.",
  "Kỷ luật là cầu nối giữa mục tiêu và thành tựu.",
  "Đừng đợi mọi thứ hoàn hảo rồi mới hành động, hãy hành động để làm mọi thứ hoàn hảo.",
  "Mỗi dòng code bạn viết hôm nay là viên gạch xây dựng sự nghiệp ngày mai.",
  "Kiên trì vượt qua khó khăn, thành quả ngọt ngào đang chờ bạn phía trước.",
  "Không có mốc thời gian nào muộn để bắt đầu phát triển bản thân.",
  "Học hỏi không bao giờ làm cạn kiệt tâm trí."
];
