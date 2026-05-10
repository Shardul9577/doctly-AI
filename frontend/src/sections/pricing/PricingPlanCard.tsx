import { ReactElement, useState } from 'react';
import Link from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Button,
  Typography,
  Box,
  Stack,
  Tooltip,
  Chip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
// types
import { Plan } from '../../services/plans';
import { PATH_AUTH } from 'src/routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 350,
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  transition: theme.transitions.create(['transform', 'box-shadow']),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  minHeight: 480,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.customShadows.z16,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[50],
  },
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(3),
  },
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  plan: Plan;
  index: number;
};

export default function PricingPlanCard({ plan, index }: Props) {
  const { name, price, duration, token_limit, features, billing_cycle } = plan;
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <RootStyle>
      {index === 1 && (
        <Label
          color="info"
          sx={{
            top: 8,
            right: 8,
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '0.65rem',
          }}
        >
          POPULAR
        </Label>
      )}

      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          mb: 0.5,
        }}
      >
        {name}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          mb: 0.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mr: 0.5,
            fontWeight: 'bold',
          }}
        >
          ₹
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mx: 1,
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          {price === 0 ? 'Free' : price.toLocaleString()}
        </Typography>
        <Typography
          gutterBottom
          component="span"
          variant="body2"
          sx={{
            alignSelf: 'flex-end',
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          /
          {duration === 0
            ? ''
            : duration === 1
            ? 'mo'
            : duration === 12
            ? 'year'
            : 'mo'}
        </Typography>
      </Box>

      {token_limit > 0 && (
        <Box
          sx={{
            backgroundColor: '#E3F2FD',
            color: '#1976D2',
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            mb: 1.5,
            textAlign: 'center',
            border: '1px solid #BBDEFB',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
          >
            {token_limit} Reports
          </Typography>
        </Box>
      )}

      <Stack spacing={0.5} sx={{ my: 1.5, width: 1, flex: 1 }}>
        {features.map((feature) => (
          <Tooltip
            key={feature.key}
            title={feature.description}
            placement="top"
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <FeatureItem
              onMouseEnter={() => setHoveredFeature(feature.key)}
              onMouseLeave={() => setHoveredFeature(null)}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Iconify
                icon="eva:checkmark-circle-2-fill"
                sx={{
                  width: 16,
                  height: 16,
                  color: 'success.main',
                  mr: 1,
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    color: 'text.primary',
                    fontSize: '0.8rem',
                  }}
                >
                  {feature.title}
                </Typography>{' '}
                {feature.star_feature && (
                  <StarIcon
                    sx={{
                      color: '#FFD700',
                      fontSize: 16,
                      mr: 0.5,
                    }}
                  />
                )}
              </Box>
            </FeatureItem>
          </Tooltip>
        ))}
      </Stack>

      <Link href={PATH_AUTH.register} passHref>
        <Button
          fullWidth
          size="small"
          variant={index === 1 ? 'contained' : 'outlined'}
          sx={{
            mt: 'auto',
            fontWeight: 'bold',
            py: 0.75,
            fontSize: '0.85rem',
            borderRadius: 1,
            textTransform: 'none',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 2,
            },
          }}
        >
          {price === 0 ? 'Current Plan' : `Choose ${name.split(' ')[0]}`}
        </Button>
      </Link>
    </RootStyle>
  );
}
