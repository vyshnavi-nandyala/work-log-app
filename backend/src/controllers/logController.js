const prisma = require('../config/database');
const { calculateDuration, buildLogsFilter, generateCsv } = require('../utils/helpers');

const include = { category: { select: { id: true, name: true, color: true, icon: true } } };

const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, sortBy = 'startTime', sortOrder = 'desc', ...filters } = req.query;
    const where = buildLogsFilter(filters);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.workLog.findMany({
        where,
        include,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit),
      }),
      prisma.workLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

const getLogById = async (req, res, next) => {
  try {
    const log = await prisma.workLog.findUnique({ where: { id: req.params.id }, include });
    if (!log) return res.status(404).json({ success: false, error: 'Work log not found' });
    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

const createLog = async (req, res, next) => {
  try {
    const { startTime, endTime, ...rest } = req.body;
    const durationMinutes = calculateDuration(startTime, endTime);
    const log = await prisma.workLog.create({
      data: { ...rest, startTime: new Date(startTime), endTime: endTime ? new Date(endTime) : null, durationMinutes },
      include,
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

const updateLog = async (req, res, next) => {
  try {
    const { startTime, endTime, ...rest } = req.body;
    const durationMinutes = calculateDuration(startTime, endTime);
    const log = await prisma.workLog.update({
      where: { id: req.params.id },
      data: { ...rest, startTime: new Date(startTime), endTime: endTime ? new Date(endTime) : null, durationMinutes },
      include,
    });
    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    await prisma.workLog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Work log deleted' });
  } catch (err) {
    next(err);
  }
};

const exportLogs = async (req, res, next) => {
  try {
    const { format = 'csv', ...filters } = req.body;
    const where = buildLogsFilter(filters);
    const logs = await prisma.workLog.findMany({
      where,
      include,
      orderBy: { startTime: 'desc' },
    });

    if (format === 'csv') {
      const csv = generateCsv(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="work-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
    }

    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, getLogById, createLog, updateLog, deleteLog, exportLogs };
