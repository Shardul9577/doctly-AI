import merge from 'lodash/merge';
// @mui
import { Card, CardHeader, Box, CardProps } from '@mui/material';
// components
import ReactApexChart, { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chartLabels: string[];
  chartData: {
    name: string;
    type: string;
    fill?: string;
    data: number[];
  }[];
}

export default function AnalyticsWebsiteVisits({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}: Props) {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: {
      bar: { columnWidth: '16%' },
    },
    fill: {
      type: chartData.map((i) => i.fill),
    },
    xaxis: {
      type: 'category', // <-- changed from 'datetime'
      categories: chartLabels, // <-- use your passed labels
      tickPlacement: 'on',
      labels: {
        rotate: -45, // optional: improves mobile readability
        style: {
          colors: '#888', // or use theme.palette.text.primary
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return `₹ ${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }} dir='ltr'>
        <ReactApexChart
          type='line'
          series={chartData}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
