const mongoose = require('mongoose');
const Visitor = require('../models/Visitor.cjs');

const isConnected = () => mongoose.connection.readyState === 1;

const logVisit = async ({ ip, userAgent, path }) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const now = new Date();
  const fiveSecondsAgo = new Date(now.getTime() - 5000);

  const existingVisit = await Visitor.findOne({
    ip,
    userAgent,
    path,
    $or: [
      { date: { $gte: fiveSecondsAgo } },
      { createdAt: { $gte: fiveSecondsAgo } }
    ]
  });

  if (existingVisit) {
    return { ok: true, duplicated: true };
  }

  await Visitor.create({ ip, userAgent, path, date: now });
  return { ok: true, duplicated: false };
};

const buildStatsFallback = () => ({
  success: true,
  today: 0,
  thisWeek: 0,
  total: 0,
  hourly: Array(24).fill(0),
  weekly: Array(7).fill(0),
  daily: Array(7).fill(0),
  dailyLabels: []
});

const getStats = async () => {
  if (!isConnected()) {
    return buildStatsFallback();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisWeekStart = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  thisWeekStart.setDate(today.getDate() - daysToMonday);
  thisWeekStart.setHours(0, 0, 0, 0);

  const dailyLabels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyLabels.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }

  const statsPipeline = [
    {
      $facet: {
        total: [{ $count: 'count' }],
        today: [
          {
            $match: {
              $or: [
                { date: { $gte: today, $lt: tomorrow } },
                { createdAt: { $gte: today, $lt: tomorrow } }
              ]
            }
          },
          { $count: 'count' }
        ],
        thisWeek: [
          {
            $match: {
              $or: [
                { date: { $gte: thisWeekStart } },
                { createdAt: { $gte: thisWeekStart } }
              ]
            }
          },
          { $count: 'count' }
        ],
        hourly: [
          {
            $match: {
              $or: [
                { date: { $gte: today, $lt: tomorrow } },
                { createdAt: { $gte: today, $lt: tomorrow } }
              ]
            }
          },
          {
            $group: {
              _id: {
                $hour: { $ifNull: ['$date', '$createdAt'] }
              },
              count: { $sum: 1 }
            }
          }
        ],
        weekly: [
          {
            $match: {
              $or: [
                { date: { $gte: thisWeekStart } },
                { createdAt: { $gte: thisWeekStart } }
              ]
            }
          },
          {
            $group: {
              _id: {
                $let: {
                  vars: {
                    dayOfWeek: {
                      $dayOfWeek: { $ifNull: ['$date', '$createdAt'] }
                    }
                  },
                  in: {
                    $cond: [
                      { $eq: ['$$dayOfWeek', 1] },
                      6,
                      { $subtract: ['$$dayOfWeek', 2] }
                    ]
                  }
                }
              },
              count: { $sum: 1 }
            }
          }
        ],
        daily: [
          {
            $match: {
              $or: [
                { date: { $gte: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) } },
                { createdAt: { $gte: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) } }
              ]
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $ifNull: ['$date', '$createdAt'] }
                }
              },
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ];

  const [statsResult] = await Visitor.aggregate(statsPipeline);

  const totalCount = statsResult.total[0]?.count || 0;
  const todayCount = statsResult.today[0]?.count || 0;
  const thisWeekCount = statsResult.thisWeek[0]?.count || 0;

  const hourlyStats = Array(24).fill(0);
  statsResult.hourly.forEach((item) => {
    if (item._id >= 0 && item._id < 24) {
      hourlyStats[item._id] = item.count;
    }
  });

  const weeklyStats = Array(7).fill(0);
  statsResult.weekly.forEach((item) => {
    if (item._id >= 0 && item._id < 7) {
      weeklyStats[item._id] = item.count;
    }
  });

  const dailyStats = Array(7).fill(0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  statsResult.daily.forEach((item) => {
    const itemDate = new Date(item._id);
    const dayIndex = Math.floor((itemDate - sevenDaysAgo) / (24 * 60 * 60 * 1000));
    if (dayIndex >= 0 && dayIndex < 7) {
      dailyStats[dayIndex] = item.count;
    }
  });

  return {
    success: true,
    today: todayCount,
    thisWeek: thisWeekCount,
    total: totalCount,
    hourly: hourlyStats,
    weekly: weeklyStats,
    daily: dailyStats,
    dailyLabels,
  };
};

const getMonthlyStats = async ({ year, month }) => {
  if (!isConnected()) {
    return {
      success: true,
      monthly: Array(new Date(year, month, 0).getDate()).fill(0),
      labels: Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => `${i + 1}`),
      year,
      month,
      daysInMonth: new Date(year, month, 0).getDate(),
    };
  }

  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);
  const daysInMonth = endDate.getDate();

  const monthlyPipeline = [
    {
      $match: {
        $or: [
          { date: { $gte: startDate, $lte: endDate } },
          { createdAt: { $gte: startDate, $lte: endDate } }
        ]
      }
    },
    {
      $group: {
        _id: {
          $dayOfMonth: { $ifNull: ['$date', '$createdAt'] }
        },
        count: { $sum: 1 }
      }
    }
  ];

  const monthlyResults = await Visitor.aggregate(monthlyPipeline);

  const monthlyStats = Array(daysInMonth).fill(0);
  const monthlyLabels = [];

  monthlyResults.forEach((item) => {
    const day = item._id;
    if (day >= 1 && day <= daysInMonth) {
      monthlyStats[day - 1] = item.count;
    }
  });

  for (let day = 1; day <= daysInMonth; day++) {
    monthlyLabels.push(`${day}`);
  }

  return {
    success: true,
    monthly: monthlyStats,
    labels: monthlyLabels,
    year,
    month,
    daysInMonth,
  };
};

const listVisitors = async ({ limit = 50, page = 1, startDate, endDate, sort }) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const skip = (page - 1) * limit;
  let start = null;
  let end = null;

  if (startDate) {
    const [year, month, day] = startDate.split('-').map(Number);
    start = new Date(Date.UTC(year, month - 1, day - 1, 15, 0, 0, 0));
  }

  if (endDate) {
    const [year, month, day] = endDate.split('-').map(Number);
    end = new Date(Date.UTC(year, month - 1, day, 14, 59, 59, 999));
  }

  const query = {};
  if (start || end) {
    const dateCondition = {};
    if (start) dateCondition.$gte = start;
    if (end) dateCondition.$lte = end;
    query.date = dateCondition;
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;
  const sortOptions = { date: sortOrder, createdAt: sortOrder };

  const visitors = await Visitor.find(query).sort(sortOptions).limit(limit).skip(skip).lean();
  const total = await Visitor.countDocuments(query);

  return {
    ok: true,
    data: visitors,
    total,
    page,
    limit,
  };
};

const clearVisitors = async () => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const result = await Visitor.deleteMany({});
  return { ok: true, deletedCount: result.deletedCount };
};

module.exports = {
  logVisit,
  getStats,
  getMonthlyStats,
  listVisitors,
  clearVisitors,
};
