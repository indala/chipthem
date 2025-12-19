'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdminAnalyticsStore } from '@/store/useAdminAnalyticsStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import DashboardCard from './DashboardCard';
import { Users, PawPrint, AlertTriangle, Home } from 'lucide-react';

const PERIODS = {
  '7d': 7,
  '30d': 30,
  '6m': 180,
  '12m': 365,
  all: Infinity
};

function getDateDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function monthKey(d: string | Date) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const COLORS = {
  blue: ['#3b82f6', '#60a5fa'],
  green: ['#10b981', '#34d399'],
  purple: ['#8b5cf6', '#a78bfa'],
  yellow: ['#facc15', '#fcd34d'],
  orange: ['#f97316', '#fb923c'],
  red: ['#ef4444', '#f87171'],
  teal: ['#14b8a6', '#2dd4bf'],
  gray: ['#9ca3af', '#d1d5db']
};

export default function AnalyticsClient() {
  const { analytics, loading, error, fetchAnalytics } = useAdminAnalyticsStore();
  const [range, setRange] = useState<keyof typeof PERIODS>('12m');

  useEffect(() => {
    if (!analytics && !loading) fetchAnalytics();
  }, [analytics, loading, fetchAnalytics]);

  const filteredData = useMemo(() => {
    if (!analytics) return null;

    const days = PERIODS[range];
    const cutoff = range === 'all' ? null : getDateDaysAgo(days);

    function filterByDate<T extends { created_at?: string | null }>(arr: T[]): T[] {
      if (!cutoff) {
        // keep only items with a valid created_at
        return arr.filter((item) => {
          if (!item.created_at) return false;
          const created = new Date(item.created_at);
          return !isNaN(created.getTime());
        });
      }

      return arr.filter((item) => {
        if (!item.created_at) return false;
        const created = new Date(item.created_at);
        return !isNaN(created.getTime()) && created >= cutoff;
      });
    }

    return {
      pets: filterByDate(analytics.pets),
      owners: filterByDate(analytics.owners),
      vets: filterByDate(analytics.vets),
      lostReports: filterByDate(analytics.lostReports),
      foundReports: filterByDate(analytics.foundReports),
    };
  }, [analytics, range]);


  /* Pets Registered */
  const petsByMonth = useMemo(() => {
    if (!filteredData) return [];

    const map = new Map<string, number>();

    filteredData.pets.forEach((p) => {
  if (!p.created_at) return; // skip items without created_at

  const created = new Date(p.created_at);
  if (isNaN(created.getTime())) return; // skip invalid dates

  const k = monthKey(created); // now argument is Date, not string | undefined
  map.set(k, (map.get(k) || 0) + 1);
});


    return [...map.entries()].map(([month, count]) => ({ month, count }));
  }, [filteredData]);

  /* Lost vs Found by month */
  const lostFoundByMonth = useMemo(() => {
    if (!filteredData) return [];

    const result = new Map<string, { lost: number; found: number }>();

    filteredData.lostReports.forEach((r) => {
      const k = monthKey(r.created_at);
      if (!result.has(k)) result.set(k, { lost: 0, found: 0 });
      result.get(k)!.lost++;
    });

    filteredData.foundReports.forEach((r) => {
      const k = monthKey(r.created_at);
      if (!result.has(k)) result.set(k, { lost: 0, found: 0 });
      result.get(k)!.found++;
    });

    return [...result.entries()].map(([month, v]) => ({ month, ...v }));
  }, [filteredData]);

  /* Pet type distribution */
  const petTypeDistribution = useMemo(() => {
    if (!filteredData) return [];

    const base = { dog: 0, cat: 0, bird: 0, other: 0 };

    filteredData.pets.forEach((p) => {
      const t = (p.pet_type || 'other').toLowerCase();

      if (t.includes('dog')) base.dog++;
      else if (t.includes('cat')) base.cat++;
      else if (t.includes('bird')) base.bird++;
      else base.other++;
    });

    return Object.entries(base).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  /* Verification donut */
  const verificationCombined = useMemo(() => {
    if (!filteredData) return [];

    const ownersVerified = filteredData.owners.filter((o) => o.is_verified).length;
    const ownersUnverified = filteredData.owners.length - ownersVerified;

    const vetsVerified = filteredData.vets.filter((v) => v.is_verified).length;
    const vetsUnverified = filteredData.vets.length - vetsVerified;

    return [
      { name: 'Owners - Verified', value: ownersVerified, color: COLORS.green[0] },
      { name: 'Owners - Unverified', value: ownersUnverified, color: COLORS.yellow[0] },
      { name: 'Vets - Verified', value: vetsVerified, color: COLORS.blue[0] },
      { name: 'Vets - Unverified', value: vetsUnverified, color: COLORS.orange[0] }
    ];
  }, [filteredData]);

  /* Resolved vs Unresolved (lost + found) */
  const resolutionStatusData = useMemo(() => {
    if (!filteredData) return [];

    const lostResolved = filteredData.lostReports.filter(
      (r) => r.status === 'resolved'
    ).length;
    const lostUnresolved = filteredData.lostReports.length - lostResolved;

    const foundResolved = filteredData.foundReports.filter(
      (r) => r.status === 'resolved'
    ).length;
    const foundUnresolved = filteredData.foundReports.length - foundResolved;

    return [
      {
        category: 'Lost',
        resolved: lostResolved,
        unresolved: lostUnresolved
      },
      {
        category: 'Found',
        resolved: foundResolved,
        unresolved: foundUnresolved
      }
    ];
  }, [filteredData]);

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!filteredData) return null;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Analytics Overview</h1>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as keyof typeof PERIODS)}
          className="
            border rounded-xl px-3 py-2 shadow
            bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
            text-white font-semibold
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        >
          <option className="text-black" value="7d">
            Last 7 days
          </option>
          <option className="text-black" value="30d">
            Last 30 days
          </option>
          <option className="text-black" value="6m">
            Last 6 months
          </option>
          <option className="text-black" value="12m">
            Last 12 months
          </option>
          <option className="text-black" value="all">
            All time
          </option>
        </select>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DashboardCard
          label="Total Owners"
          value={filteredData.owners.length}
          icon={<Users />}
          color="blue"
          description="Registered owners"
        />
        <DashboardCard
          label="Total Vets"
          value={filteredData.vets.length}
          icon={<Home />}
          color="green"
          description="Registered clinics"
        />
        <DashboardCard
          label="Total Pets"
          value={filteredData.pets.length}
          icon={<PawPrint />}
          color="purple"
          description="Registered pets"
        />
        <DashboardCard
          label="Total Reports"
          value={
            filteredData.lostReports.length + filteredData.foundReports.length
          }
          icon={<AlertTriangle />}
          color="red"
          description="Lost + Found reports"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pets Registered */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 shadow">
          <h2 className="text-lg font-medium mb-2">
            Pets Registered ({range.toUpperCase()})
          </h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={petsByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.purple[0]}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lost vs Found by month */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 shadow">
          <h2 className="text-lg font-medium mb-2">
            Lost vs Found ({range.toUpperCase()})
          </h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lostFoundByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="lost" fill={COLORS.red[0]} />
                <Bar dataKey="found" fill={COLORS.green[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pets by type */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 shadow">
          <h2 className="text-lg font-medium mb-2">Pets by Type</h2>
          <div
            style={{ width: '100%', height: 280 }}
            className="flex items-center justify-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={petTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={40}
                  label
                >
                  {petTypeDistribution.map((_, idx) => {
                    const palette = [
                      COLORS.blue[0],
                      COLORS.purple[0],
                      COLORS.teal[0],
                      COLORS.gray[0]
                    ];
                    return <Cell key={idx} fill={palette[idx]} />;
                  })}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification donut */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 shadow">
          <h2 className="text-lg font-medium mb-2">Verification Breakdown</h2>
          <div
            style={{ width: '100%', height: 280 }}
            className="flex items-center justify-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationCombined}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={50}
                  label
                >
                  {verificationCombined.map((item, idx) => (
                    <Cell key={idx} fill={item.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution status (new bar chart) */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 shadow lg:col-span-2">
          <h2 className="text-lg font-medium mb-2">
            Resolution Status ({range.toUpperCase()})
          </h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionStatusData}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="unresolved" fill={COLORS.red[0]} />
                <Bar dataKey="resolved" fill={COLORS.green[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
