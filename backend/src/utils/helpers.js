const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const diff = new Date(endTime) - new Date(startTime);
  return Math.round(diff / (1000 * 60));
};

const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const buildLogsFilter = (query) => {
  const where = {};
  const { search, category, status, priority, startDate, endDate, tags } = query;

  if (search) {
    where.OR = [
      { taskName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { project: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) where.categoryId = category;
  if (status) where.status = status;
  if (priority) where.priority = priority;

  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate);
    if (endDate) where.startTime.lte = new Date(endDate);
  }

  if (tags) {
    const tagList = Array.isArray(tags) ? tags : [tags];
    where.tags = { hasSome: tagList };
  }

  return where;
};

const generateCsv = (logs) => {
  const header = ['Task Name', 'Description', 'Project', 'Category', 'Start Time', 'End Time', 'Duration (min)', 'Tags', 'Status', 'Priority'];
  const rows = logs.map(log => [
    `"${(log.taskName || '').replace(/"/g, '""')}"`,
    `"${(log.description || '').replace(/"/g, '""')}"`,
    `"${(log.project || '').replace(/"/g, '""')}"`,
    `"${(log.category?.name || '').replace(/"/g, '""')}"`,
    log.startTime ? new Date(log.startTime).toISOString() : '',
    log.endTime ? new Date(log.endTime).toISOString() : '',
    log.durationMinutes || '',
    `"${(log.tags || []).join(', ')}"`,
    log.status || '',
    log.priority || '',
  ].join(','));
  return [header.join(','), ...rows].join('\n');
};

module.exports = { calculateDuration, formatDuration, buildLogsFilter, generateCsv };
