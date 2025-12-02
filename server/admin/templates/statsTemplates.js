export const statsCardsTemplate = (stats) => `
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">오늘 방문자</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${stats.today || 0}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <i data-lucide="sun" class="w-6 h-6 text-blue-600"></i>
        </div>
      </div>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">이번 주 방문자</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${stats.thisWeek || 0}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <i data-lucide="calendar" class="w-6 h-6 text-purple-600"></i>
        </div>
      </div>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">전체 방문자</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${stats.total || 0}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <i data-lucide="trending-up" class="w-6 h-6 text-green-600"></i>
        </div>
      </div>
    </div>
  </div>
`;

const gridLines = (count, width, height) =>
  Array.from({ length: count }, (_, i) => {
    const ratio = i / (count - 1);
    const y = height - height * ratio;
    return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="2,2" />`;
  }).join('');

export const todayChartTemplate = ({ hourlyData, total, maxValue, chartHeight, barWidth, barGap, currentHour, totalWidth }) => `
  <div class="px-6 py-4 border-b">
    <h3 class="text-lg font-semibold text-gray-900">오늘 방문자</h3>
    <p class="text-xs text-gray-500 mt-1">총 ${total}명</p>
  </div>
  <div class="p-6 relative">
    <div id="tooltip-today" class="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none opacity-0 transition-opacity z-10" style="transform: translateX(-50%);"></div>
    <div class="overflow-x-auto" id="today-chart-scroll" style="scroll-behavior: auto;">
      <svg width="${totalWidth}" height="${chartHeight + 40}" class="min-w-full" viewBox="0 0 ${totalWidth} ${chartHeight + 40}">
        ${gridLines(5, totalWidth, chartHeight)}
        ${hourlyData.map((count, hour) => {
          const x = hour * (barWidth + barGap);
          const barHeight = (count / maxValue) * chartHeight;
          const y = chartHeight - barHeight;
          const isCurrentHour = currentHour === hour;
          
          return `
            <g>
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                fill="${isCurrentHour ? '#8b5cf6' : '#a78bfa'}" rx="3" 
                class="hover:opacity-80 transition-opacity cursor-pointer bar-today"
                data-hour="${hour}"
                data-count="${count}" />
              <text x="${x + barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" class="text-xs fill-gray-600 font-medium">${hour}시</text>
            </g>
          `;
        }).join('')}
      </svg>
    </div>
  </div>
`;

export const weeklyChartTemplate = ({ weeklyData, total, maxValue, chartHeight, dayLabels, adjustedCurrentDay }) => `
  <div class="px-6 py-4 border-b">
    <h3 class="text-lg font-semibold text-gray-900">이번 주 방문자</h3>
    <p class="text-xs text-gray-500 mt-1">총 ${total}명</p>
  </div>
  <div class="p-6">
    <svg width="100%" height="${chartHeight + 40}" viewBox="0 0 420 ${chartHeight + 40}">
      ${gridLines(5, 420, chartHeight)}
      ${weeklyData.map((count, idx) => {
        const barWidth = 40;
        const gap = 20;
        const x = idx * (barWidth + gap);
        const barHeight = (count / maxValue) * chartHeight;
        const y = chartHeight - barHeight;
        const isCurrentDay = adjustedCurrentDay === idx;
        return `
          <g>
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
              fill="${isCurrentDay ? '#10b981' : '#34d399'}" rx="4"
              class="hover:opacity-80 transition-opacity" />
            <text x="${x + barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" class="text-sm fill-gray-700 font-medium">${dayLabels[idx]}</text>
            <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" class="text-xs fill-gray-500">${count}</text>
          </g>
        `;
      }).join('')}
    </svg>
  </div>
`;

export const monthlyChartTemplate = ({ safeData, safeLabels, currentMonthlyYear, currentMonthlyMonth, chartHeight, barWidth, barGap }) => {
  const maxValue = Math.max(...safeData, 1);
  const daysInMonth = safeData.length;
  const totalWidth = (barWidth + barGap) * daysInMonth;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentMonthlyYear && today.getMonth() + 1 === currentMonthlyMonth;

  return `
    <div class="px-6 py-4 border-b">
      <div class="flex items-center justify-between mb-4 flex-nowrap gap-4">
        <div class="flex-shrink-0">
          <h3 class="text-lg font-semibold text-gray-900 whitespace-nowrap">전체 방문자</h3>
          <p class="text-xs text-gray-500 mt-1 whitespace-nowrap">월별 통계</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <button onclick="changeMonthlyDate(-1)" class="p-2 hover:bg-gray-100 rounded transition flex-shrink-0">
            <i data-lucide="chevron-left" class="w-5 h-5 text-gray-600"></i>
          </button>
          <div class="flex items-center gap-2 flex-shrink-0">
            <select id="monthly-year-select" onchange="updateMonthlyChart()" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap">
              ${Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return `<option value="${year}" ${year === currentMonthlyYear ? 'selected' : ''}>${year}년</option>`;
              }).join('')}
            </select>
            <select id="monthly-month-select" onchange="updateMonthlyChart()" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap">
              ${Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                return `<option value="${month}" ${month === currentMonthlyMonth ? 'selected' : ''}>${month}월</option>`;
              }).join('')}
            </select>
          </div>
          <button onclick="changeMonthlyDate(1)" class="p-2 hover:bg-gray-100 rounded transition flex-shrink-0">
            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-600"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="p-6 relative">
      <div id="tooltip-monthly" class="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none opacity-0 transition-opacity z-10" style="transform: translateX(-50%);"></div>
      <div class="overflow-x-auto" id="monthly-chart-scroll" style="scroll-behavior: auto;">
        <svg width="${totalWidth}" height="${chartHeight + 40}" class="min-w-full" viewBox="0 0 ${totalWidth} ${chartHeight + 40}">
          ${gridLines(5, totalWidth, chartHeight)}
          ${safeData.map((count, idx) => {
            const x = idx * (barWidth + barGap);
            const barHeight = (count / maxValue) * chartHeight;
            const y = chartHeight - barHeight;
            const isToday = isCurrentMonth && today.getDate() - 1 === idx;
            return `
              <g>
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                  fill="${isToday ? '#f97316' : '#fb923c'}" rx="3"
                  class="hover:opacity-80 transition-opacity cursor-pointer bar-monthly"
                  data-day="${safeLabels[idx]}"
                  data-count="${count}" />
                <text x="${x + barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" class="text-xs fill-gray-600 font-medium">${safeLabels[idx]}</text>
              </g>
            `;
          }).join('')}
        </svg>
      </div>
    </div>
  `;
};
