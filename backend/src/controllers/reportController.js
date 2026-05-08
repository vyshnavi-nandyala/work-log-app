const prisma = require('../config/database');

const include = { category: { select: { id: true, name: true, color: true, icon: true } } };

const buildDateRange = (type, date) => {
  const d = date ? new Date(date) : new Date();
  let start, end;

  if (type === 'daily') {
    start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  } else if (type === 'weekly') {
    start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
    end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else {
    start = new Date(d.getFullYear(), d.getMonth(), 1);
    end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  return { start, end };
};

const buildReport = async (type, date) => {
  const { start, end } = buildDateRange(type, date);
  const where = { startTime: { gte: start, lt: end } };

  const [logs, aggregate, categoryBreakdown] = await Promise.all([
    prisma.workLog.findMany({ where, include, orderBy: { startTime: 'asc' } }),
    prisma.workLog.aggregate({ where, _sum: { durationMinutes: true }, _count: true }),
    prisma.workLog.groupBy({
      by: ['categoryId'],
      where: { ...where, categoryId: { not: null } },
      _sum: { durationMinutes: true },
      _count: true,
    }),
  ]);

  const categoryIds = categoryBreakdown.map(c => c.categoryId).filter(Boolean);
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  const breakdown = categoryBreakdown.map(c => ({
    category: catMap[c.categoryId] || { name: 'Uncategorized', color: '#64748b', icon: '📁' },
    totalMinutes: c._sum.durationMinutes || 0,
    taskCount: c._count,
  })).sort((a, b) => b.totalMinutes - a.totalMinutes);

  return {
    period: { start, end, type },
    summary: {
      totalMinutes: aggregate._sum.durationMinutes || 0,
      totalTasks: aggregate._count,
    },
    categoryBreakdown: breakdown,
    logs,
  };
};

const getDailyReport = async (req, res, next) => {
  try {
    const report = await buildReport('daily', req.query.date);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

const getWeeklyReport = async (req, res, next) => {
  try {
    const report = await buildReport('weekly', req.query.date);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const report = await buildReport('monthly', req.query.date);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDailyReport, getWeeklyReport, getMonthlyReport };
