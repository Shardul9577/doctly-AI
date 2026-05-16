import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { sentenceCase } from 'change-case';
import axiosInstance from 'src/utils/axios';

dayjs.extend(customParseFormat);

export type DoctorVisit = {
  _id: string;
  visit_date: string;
  visit_time?: string;
  visit_type?: string;
  status: string;
  diagnosis?: string[];
  symptoms?: string[];
  doctor_patient_relations_id?: {
    patient_id?: {
      firstName?: string;
      lastName?: string;
      profile_picture?: string;
    };
  };
  createdAt?: string;
};

export type ChartDatum = { label: string; value: number };

export type DoctorDashboardStats = {
  totalPatients: number;
  totalVisits: number;
  todayVisits: number;
  pendingVisits: number;
  completedVisits: number;
  patientTrendPercent: number;
  visitTrendPercent: number;
  patientSparkline: number[];
  visitSparkline: number[];
  statusBreakdown: ChartDatum[];
  visitTypeBreakdown: ChartDatum[];
  monthlyVisits: { labels: string[]; data: number[] };
  topDiagnoses: ChartDatum[];
  recentVisits: DoctorVisit[];
  activityTimeline: { id: string; title: string; time: string | Date; type: string }[];
};

const VISIT_DATE_FORMAT = 'DD/MM/YYYY';

function parseVisitDate(dateStr: string) {
  return dayjs(dateStr, VISIT_DATE_FORMAT);
}

function countByField(visits: DoctorVisit[], field: 'status' | 'visit_type'): ChartDatum[] {
  const counts: Record<string, number> = {};
  visits.forEach((v) => {
    const key = (v[field] as string) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, value]) => ({ label: sentenceCase(label), value }))
    .sort((a, b) => b.value - a.value);
}

function monthlyVisitSeries(visits: DoctorVisit[], monthCount = 6) {
  const labels: string[] = [];
  const data: number[] = [];
  const now = dayjs();

  for (let i = monthCount - 1; i >= 0; i--) {
    const month = now.subtract(i, 'month');
    labels.push(month.format('MMM YYYY'));
    const count = visits.filter((v) => {
      const d = parseVisitDate(v.visit_date);
      return d.isValid() && d.month() === month.month() && d.year() === month.year();
    }).length;
    data.push(count);
  }

  return { labels, data };
}

function sparklineFromMonthly(monthlyData: number[]) {
  return monthlyData.length ? monthlyData : [0, 0, 0, 0, 0, 0];
}

function trendPercent(monthlyData: number[]): number {
  if (monthlyData.length < 2) return 0;
  const current = monthlyData[monthlyData.length - 1] || 0;
  const previous = monthlyData[monthlyData.length - 2] || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function topDiagnoses(visits: DoctorVisit[], limit = 8): ChartDatum[] {
  const counts: Record<string, number> = {};
  visits.forEach((v) => {
    (v.diagnosis || []).forEach((d) => {
      const trimmed = d?.trim();
      if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function statusTimelineType(status: string): string {
  const s = status?.toLowerCase() || '';
  if (s.includes('complete')) return 'order2';
  if (s.includes('pending') || s.includes('schedule')) return 'order3';
  if (s.includes('approve')) return 'order1';
  return 'order4';
}

function computeStats(
  visits: DoctorVisit[],
  totalPatients: number,
  totalVisitsMeta: number
): DoctorDashboardStats {
  const today = dayjs().startOf('day');
  const todayVisits = visits.filter((v) => {
    const d = parseVisitDate(v.visit_date);
    return d.isValid() && d.isSame(today, 'day');
  }).length;

  const pendingVisits = visits.filter((v) => {
    const s = v.status?.toLowerCase() || '';
    return s.includes('pending') || s.includes('schedule') || s.includes('waiting');
  }).length;

  const completedVisits = visits.filter((v) => {
    const s = v.status?.toLowerCase() || '';
    return s.includes('complete');
  }).length;

  const { labels, data: monthlyData } = monthlyVisitSeries(visits);
  const visitTrendPercent = trendPercent(monthlyData);

  const recentVisits = [...visits]
    .sort((a, b) => {
      const da = parseVisitDate(a.visit_date);
      const db = parseVisitDate(b.visit_date);
      if (!da.isValid() || !db.isValid()) return 0;
      return db.valueOf() - da.valueOf();
    })
    .slice(0, 8);

  const activityTimeline = recentVisits.slice(0, 6).map((v) => {
    const patient = v.doctor_patient_relations_id?.patient_id;
    const name = patient
      ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
      : 'Patient';
    return {
      id: v._id,
      title: `${name} — ${sentenceCase(v.status || 'visit')}`,
      time: parseVisitDate(v.visit_date).isValid()
        ? parseVisitDate(v.visit_date).toDate()
        : v.createdAt || new Date(),
      type: statusTimelineType(v.status),
    };
  });

  return {
    totalPatients,
    totalVisits: totalVisitsMeta || visits.length,
    todayVisits,
    pendingVisits,
    completedVisits,
    patientTrendPercent: 0,
    visitTrendPercent,
    patientSparkline: sparklineFromMonthly(monthlyData),
    visitSparkline: sparklineFromMonthly(monthlyData),
    statusBreakdown: countByField(visits, 'status'),
    visitTypeBreakdown: countByField(visits, 'visit_type'),
    monthlyVisits: { labels, data: monthlyData },
    topDiagnoses: topDiagnoses(visits),
    recentVisits,
    activityTimeline,
  };
}

export default function useDoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalVisitsMeta, setTotalVisitsMeta] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [visitsRes, patientsRes] = await Promise.all([
          axiosInstance.get('/api/doctors/visit/list', {
            params: { page: 1, limit: 200 },
          }),
          axiosInstance.get('/api/doctors/patient/list', {
            params: { page: 1, limit: 1 },
          }),
        ]);

        if (cancelled) return;

        setVisits(visitsRes.data?.visits || []);
        setTotalPatients(patientsRes.data?.meta?.total ?? 0);
        setTotalVisitsMeta(visitsRes.data?.meta?.total ?? 0);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => computeStats(visits, totalPatients, totalVisitsMeta),
    [visits, totalPatients, totalVisitsMeta]
  );

  return { loading, error, stats, visits };
}
