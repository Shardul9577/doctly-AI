import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { sentenceCase } from 'change-case';
import axiosInstance from 'src/utils/axios';

dayjs.extend(customParseFormat);

export type PatientVisit = {
  _id: string;
  visit_date: string;
  visit_time?: string;
  visit_type?: string;
  status: string;
  diagnosis?: string[];
  symptoms?: string[];
  ai_summary?: string;
  doctor_patient_relations_id?: {
    doctor_id?: {
      firstName?: string;
      lastName?: string;
      profile_picture?: string;
    };
    patient_id?: {
      firstName?: string;
      lastName?: string;
      profile_picture?: string;
    };
  };
  createdAt?: string;
};

export type ChartDatum = { label: string; value: number };

export type HealthUpdateItem = {
  id: string;
  title: string;
  description: string;
  postedAt: Date | number;
  image: string;
};

export type PatientDashboardStats = {
  totalVisits: number;
  totalDoctors: number;
  totalReports: number;
  todayVisits: number;
  upcomingVisits: number;
  completedVisits: number;
  visitTrendPercent: number;
  visitSparkline: number[];
  statusBreakdown: ChartDatum[];
  monthlyVisits: { labels: string[]; data: number[] };
  recentVisits: PatientVisit[];
  healthUpdates: HealthUpdateItem[];
};

const VISIT_DATE_FORMAT = 'DD/MM/YYYY';
const DEFAULT_AVATAR =
  'https://images.icon-icons.com/2266/PNG/512/patient_icon_140481.png';

function parseVisitDate(dateStr: string) {
  return dayjs(dateStr, VISIT_DATE_FORMAT);
}

function countByStatus(visits: PatientVisit[]): ChartDatum[] {
  const counts: Record<string, number> = {};
  visits.forEach((v) => {
    const key = v.status || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, value]) => ({ label: sentenceCase(label), value }))
    .sort((a, b) => b.value - a.value);
}

function monthlyVisitSeries(visits: PatientVisit[], monthCount = 6) {
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

function trendPercent(monthlyData: number[]): number {
  if (monthlyData.length < 2) return 0;
  const current = monthlyData[monthlyData.length - 1] || 0;
  const previous = monthlyData[monthlyData.length - 2] || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getVisitDoctorName(visit: PatientVisit): string {
  const doctor = visit.doctor_patient_relations_id?.doctor_id;
  if (doctor?.firstName || doctor?.lastName) {
    return `Dr. ${[doctor.firstName, doctor.lastName].filter(Boolean).join(' ')}`;
  }
  return 'Your doctor';
}

function buildHealthUpdates(visits: PatientVisit[]): HealthUpdateItem[] {
  return visits.slice(0, 5).map((v) => {
    const doctorName = getVisitDoctorName(v);
    const diagnosis = v.diagnosis?.filter(Boolean).join(', ');
    const symptoms = v.symptoms?.filter(Boolean).join(', ');
    const description =
      diagnosis ||
      symptoms ||
      v.ai_summary ||
      `Visit on ${v.visit_date} — ${sentenceCase(v.status || 'scheduled')}`;

    const d = parseVisitDate(v.visit_date);

    return {
      id: v._id,
      title: `Visit with ${doctorName}`,
      description: description.slice(0, 120) + (description.length > 120 ? '…' : ''),
      postedAt: d.isValid() ? d.toDate() : v.createdAt || new Date(),
      image:
        v.doctor_patient_relations_id?.doctor_id?.profile_picture || DEFAULT_AVATAR,
    };
  });
}

function computeStats(
  visits: PatientVisit[],
  totalVisitsMeta: number,
  totalDoctors: number,
  totalReports: number
): PatientDashboardStats {
  const today = dayjs().startOf('day');
  const todayVisits = visits.filter((v) => {
    const d = parseVisitDate(v.visit_date);
    return d.isValid() && d.isSame(today, 'day');
  }).length;

  const upcomingVisits = visits.filter((v) => {
    const s = v.status?.toLowerCase() || '';
    return s.includes('pending') || s.includes('schedule') || s.includes('waiting');
  }).length;

  const completedVisits = visits.filter((v) => {
    const s = v.status?.toLowerCase() || '';
    return s.includes('complete');
  }).length;

  const { labels, data: monthlyData } = monthlyVisitSeries(visits);

  const recentVisits = [...visits]
    .sort((a, b) => {
      const da = parseVisitDate(a.visit_date);
      const db = parseVisitDate(b.visit_date);
      if (!da.isValid() || !db.isValid()) return 0;
      return db.valueOf() - da.valueOf();
    })
    .slice(0, 8);

  return {
    totalVisits: totalVisitsMeta || visits.length,
    totalDoctors,
    totalReports,
    todayVisits,
    upcomingVisits,
    completedVisits,
    visitTrendPercent: trendPercent(monthlyData),
    visitSparkline: monthlyData.length ? monthlyData : [0, 0, 0, 0, 0, 0],
    statusBreakdown: countByStatus(visits),
    monthlyVisits: { labels, data: monthlyData },
    recentVisits,
    healthUpdates: buildHealthUpdates(recentVisits),
  };
}

export default function usePatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visits, setVisits] = useState<PatientVisit[]>([]);
  const [totalVisitsMeta, setTotalVisitsMeta] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [visitsRes, doctorsRes, reportsRes] = await Promise.all([
          axiosInstance.get('/api/patients/visit/list', {
            params: { page: 1, limit: 200 },
          }),
          axiosInstance.get('/api/patients/doctor', {
            params: { page: 1, limit: 1 },
          }),
          axiosInstance.get('/api/patients/profile/reports', {
            params: { page: 1, limit: 1, sortBy: 'created_at', sortOrder: 'desc' },
          }),
        ]);

        if (cancelled) return;

        setVisits(visitsRes.data?.visits || []);
        setTotalVisitsMeta(visitsRes.data?.meta?.total ?? 0);
        setTotalDoctors(doctorsRes.data?.meta?.total ?? doctorsRes.data?.doctors?.length ?? 0);
        setTotalReports(reportsRes.data?.meta?.total ?? reportsRes.data?.reports?.length ?? 0);
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
    () => computeStats(visits, totalVisitsMeta, totalDoctors, totalReports),
    [visits, totalVisitsMeta, totalDoctors, totalReports]
  );

  return { loading, error, stats, visits };
}
