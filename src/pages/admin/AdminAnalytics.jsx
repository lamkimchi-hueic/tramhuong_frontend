import { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiBox, FiBarChart2, FiPieChart, FiActivity, FiAward, FiCalendar, FiPercent } from 'react-icons/fi';

const AI_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

const formatVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

// Simple bar component
function Bar({ value, max, color = 'var(--color-primary)' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// Donut chart with CSS conic-gradient
function DonutChart({ segments }) {
  if (!segments || segments.length === 0) return <div className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</div>;
  const colors = ['#2d5016', '#4a7c29', '#6ba33d', '#8ecb52', '#b5de7a', '#d4edb0', '#3b82f6', '#f59e0b'];
  let acc = 0;
  const gradParts = segments.map((s, i) => {
    const start = acc;
    acc += s.percent;
    return `${colors[i % colors.length]} ${start}% ${acc}%`;
  });
  const gradient = `conic-gradient(${gradParts.join(', ')})`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-40 h-40 rounded-full flex-shrink-0" style={{ background: gradient }}>
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-gray-500">{segments.length} mục</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 w-full">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="flex-1 truncate text-gray-700">{s.category_name || s.label}</span>
            <span className="font-semibold text-gray-800">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryShare, setCategoryShare] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Helper: fetch an endpoint safely, return null on failure
    const safeFetch = async (endpoint) => {
      try {
        const baseUrl = AI_URL.replace(/\/+$/, ''); // Loại bỏ trailing slash để tránh double-slash
        const res = await fetch(`${baseUrl}/analysis/${endpoint}`);
        if (!res.ok) {
          console.warn(`AI endpoint /analysis/${endpoint} returned ${res.status}`);
          return null;
        }
        return await res.json();
      } catch (err) {
        console.warn(`AI endpoint /analysis/${endpoint} failed:`, err);
        return null;
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ov, rt, tp, cs, os, ci, fc] = await Promise.all([
          safeFetch('overview'),
          safeFetch('revenue-trend'),
          safeFetch('top-products'),
          safeFetch('category-share'),
          safeFetch('order-status'),
          safeFetch('customer-insights'),
          safeFetch('forecast'),
        ]);

        // Kiểm tra tất cả đều null → service không hoạt động
        if ([ov, rt, tp, cs, os, ci, fc].every(v => v === null)) {
          setError('Không thể kết nối đến dịch vụ phân tích. Hãy chắc chắn AI server đang chạy.');
          return;
        }

        setOverview(ov);
        setRevenueTrend(rt);
        setTopProducts(Array.isArray(tp) ? tp : []);        // Đảm bảo luôn là mảng
        setCategoryShare(Array.isArray(cs) ? cs : []);       // Đảm bảo luôn là mảng
        setOrderStatus(Array.isArray(os) ? os : []);         // Đảm bảo luôn là mảng
        setCustomers(ci);
        setForecast(fc);
      } catch (err) {
        console.error('AI Analysis fetch error:', err);
        setError('Không thể kết nối đến dịch vụ phân tích. Hãy chắc chắn AI server đang chạy.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Đang phân tích dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">Lỗi kết nối</p>
        <p className="text-red-500 text-sm">{error}</p>
        <p className="text-gray-400 text-xs mt-3">Chạy: <code className="bg-gray-100 px-2 py-1 rounded">cd ai_analysis && python main.py</code></p>
      </div>
    );
  }

  const statusColors = { Pending: '#f59e0b', Confirmed: '#3b82f6', Completed: '#2d5016', Cancelled: '#ef4444' };
  const maxSold = topProducts.length > 0 ? topProducts[0].total_sold : 1;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiActivity className="text-[var(--color-primary)]" /> Phân Tích Dữ Liệu (AI)
      </h2>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Tổng doanh thu', value: formatVND(overview.total_revenue), icon: FiTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Đơn hoàn thành', value: overview.completed_orders, icon: FiShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Sản phẩm', value: overview.total_products, icon: FiBox, color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'Khách hàng', value: overview.total_customers, icon: FiUsers, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.bg}`}>
                <c.icon size={20} className={c.color} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{c.title}</p>
                <p className="text-xl font-bold text-gray-800">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Growth card */}
      {overview && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Doanh thu tháng này</p>
              <p className="text-lg font-bold text-gray-800">{formatVND(overview.current_month_revenue)}</p>
            </div>
          </div>
          <div className="text-gray-300">→</div>
          <div>
            <p className="text-xs text-gray-400">Tháng trước</p>
            <p className="text-lg font-bold text-gray-600">{formatVND(overview.last_month_revenue)}</p>
          </div>
          <div className={`ml-auto px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 ${overview.revenue_growth_percent >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <FiPercent size={14} />
            {overview.revenue_growth_percent >= 0 ? '+' : ''}{overview.revenue_growth_percent}%
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        {revenueTrend && revenueTrend.labels && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiBarChart2 size={16} /> Doanh thu theo tháng</h3>
            {revenueTrend.labels.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-3">
                {revenueTrend.labels.map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 flex-shrink-0">{label}</span>
                    <Bar value={revenueTrend.revenue[i]} max={Math.max(...revenueTrend.revenue)} />
                    <span className="text-xs font-semibold text-gray-600 w-24 text-right flex-shrink-0">{formatVND(revenueTrend.revenue[i])}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Share */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiPieChart size={16} /> Tỷ trọng theo danh mục</h3>
          <DonutChart segments={categoryShare} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiAward size={16} /> Top sản phẩm bán chạy</h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id_product} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 3 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.product_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Bar value={p.total_sold} max={maxSold} color={i < 3 ? 'var(--color-primary)' : '#9ca3af'} />
                      <span className="text-xs text-gray-500 flex-shrink-0">{p.total_sold} SP</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary)] flex-shrink-0">{formatVND(p.total_revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiShoppingCart size={16} /> Trạng thái đơn hàng</h3>
          {orderStatus.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-4">
              {orderStatus.map((s) => {
                const total = orderStatus.reduce((acc, x) => acc + x.count, 0);
                const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : 0;
                return (
                  <div key={s.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600">{s.label}</span>
                      <span className="text-gray-500">{s.count} ({pct}%)</span>
                    </div>
                    <Bar value={s.count} max={Math.max(...orderStatus.map(x => x.count))} color={statusColors[s.status] || '#9ca3af'} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Insights */}
        {customers && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiUsers size={16} /> Khách hàng nổi bật</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{customers.new_customers_30d}</p>
                <p className="text-xs text-blue-500">Khách mới (30 ngày)</p>
              </div>
              <div className="flex-1 bg-emerald-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">{customers.returning_customers}</p>
                <p className="text-xs text-emerald-500">Khách quay lại</p>
              </div>
            </div>
            {customers.top_spenders?.length > 0 && (
              <div className="divide-y divide-gray-50">
                {customers.top_spenders.slice(0, 5).map((c, i) => (
                  <div key={c.id_user} className="flex items-center gap-3 py-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{c.username}</p>
                      <p className="text-xs text-gray-400">{c.order_count} đơn</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary)]">{formatVND(c.total_spent)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Forecast */}
        {forecast && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiTrendingUp size={16} /> Dự báo doanh thu (AI)</h3>
            {forecast.forecast_month ? (
              <>
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl p-5 text-white mb-4">
                  <p className="text-xs opacity-70 mb-1">Dự báo tháng {forecast.forecast_month}</p>
                  <p className="text-2xl font-bold">{formatVND(forecast.forecast_revenue)}</p>
                  <p className="text-xs opacity-60 mt-2">Model: {forecast.model} • R² = {forecast.confidence_r2}</p>
                </div>
                {forecast.historical?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dữ liệu lịch sử</p>
                    {forecast.historical.map((h) => (
                      <div key={h.month} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16">{h.month}</span>
                        <Bar value={h.revenue} max={Math.max(...forecast.historical.map(x => x.revenue), forecast.forecast_revenue)} />
                        <span className="text-xs text-gray-600 w-24 text-right">{formatVND(h.revenue)}</span>
                      </div>
                    ))}
                    {/* Forecast bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--color-primary)] font-bold w-16">{forecast.forecast_month}</span>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--color-primary)] opacity-40 animate-pulse" style={{ width: `${(forecast.forecast_revenue / Math.max(...forecast.historical.map(x => x.revenue), forecast.forecast_revenue)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[var(--color-primary)] font-bold w-24 text-right">{formatVND(forecast.forecast_revenue)}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">{forecast.message || 'Chưa đủ dữ liệu'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
