const prisma = require('../config/database');

const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayLogs, weekLogs, monthLogs, totalLogs, completedLogs, categoryStats] = await Promise.all([
      prisma.workLog.aggregate({ _sum: { durationMinutes: true }, where: { startTime: { gte: startOfDay } } }),
      prisma.workLog.aggregate({ _sum: { durationMinutes: true }, where: { startTime: { gte: startOfWeek } } }),
      prisma.workLog.aggregate({ _sum: { durationMinutes: true }, where: { startTime: { gte: startOfMonth } } }),
      prisma.workLog.count(),
      prisma.workLog.count({ where: { status: 'completed' } }),
      prisma.workLog.groupBy({
        by: ['categoryId'],
        _sum: { durationMinutes: true },
        _count: true,
        orderBy: { _sum: { durationMinutes: 'desc' } },
        take: 1,
        where: { categoryId: { not: null } },
      }),
    ]);

    const topCategoryId = categoryStats[0]?.categoryId;
    let topCategory = null;
    if (topCategoryId) {
      topCategory = await prisma.category.findUnique({ where: { id: topCategoryId }, select: { name: true } });
    }

    const daysInMonth = Math.max(1, Math.ceil((now - startOfMonth) / (1000 * 60 * 60 * 24)));
    const monthMinutes = monthLogs._sum.durationMinutes || 0;

    res.json({
      success: true,
      data: {
        todayMinutes: todayLogs._sum.durationMinutes || 0,
        weekMinutes: weekLogs._sum.durationMinutes || 0,
        monthMinutes,
        avgMinutesPerDay: Math.round(monthMinutes / daysInMonth),
        totalTasks: totalLogs,
        completedTasks: completedLogs,
        taskCompletionRate: totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0,
        mostActiveCategory: topCategory?.name || 'N/A',
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
