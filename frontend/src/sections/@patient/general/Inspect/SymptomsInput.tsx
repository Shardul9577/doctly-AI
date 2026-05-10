import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
} from '@mui/material';

export default function SymptomsPage() {
  const [symptom, setSymptom] = useState('');
  const [symptomList, setSymptomList] = useState([]);

  const [details, setDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    age: '',
    gender: '',
    state: '',
  });

  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescription, setPrescription] = useState(
    `Patient is advised to take prescribed medication regularly.\nMaintain proper hydration and get adequate rest.\nFollow up after 7 days or sooner if symptoms worsen.`
  );

  const handleSymptomAdd = (e) => {
    if (e.key === 'Enter' && symptom.trim()) {
      setSymptomList([...symptomList, symptom.trim()]);
      setSymptom('');
    }
  };

  const handleSymptomDelete = (index) => {
    const newList = [...symptomList];
    newList.splice(index, 1);
    setSymptomList(newList);
  };

  const handleDetailChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const patients = ['John Doe', 'Shraddha M.', 'Shardul C.', 'Neha S.'];
  const states = ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Rajasthan'];

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#0f172a',
        borderRadius: 3,
        boxShadow: '0 0 0 1px #1e293b',
        color: '#fff',
      }}
    >
      {/* Symptoms Section */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        Symptoms
      </Typography>
      <TextField
        label='Enter symptom'
        variant='outlined'
        fullWidth
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        onKeyDown={handleSymptomAdd}
        sx={inputStyle}
        InputLabelProps={{ style: { color: '#ccc' } }}
      />
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {symptomList.map((sym, index) => (
          <Chip
            key={index}
            label={sym}
            onDelete={() => handleSymptomDelete(index)}
            sx={{ backgroundColor: '#334155', color: '#fff' }}
          />
        ))}
      </Box>

      {/* Patient Details */}
      <Typography variant='h6' sx={{ mb: 2, mt: 5 }}>
        Patient Details
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <TextField
          label='Name'
          name='name'
          value={details.name}
          onChange={handleDetailChange}
          sx={inputStyle}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        <TextField
          label='Email'
          name='email'
          value={details.email}
          onChange={handleDetailChange}
          sx={inputStyle}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        <TextField
          label='Mobile'
          name='mobile'
          value={details.mobile}
          onChange={handleDetailChange}
          sx={inputStyle}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        <TextField
          label='Age'
          name='age'
          value={details.age}
          onChange={handleDetailChange}
          sx={inputStyle}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />

        <FormControl sx={inputStyle}>
          <InputLabel sx={{ color: '#ccc' }}>Gender</InputLabel>
          <Select
            name='gender'
            value={details.gender}
            onChange={handleDetailChange}
            label='Gender'
            sx={{ color: '#fff', backgroundColor: '#1e293b' }}
          >
            <MenuItem value=''>Choose...</MenuItem>
            <MenuItem value='Male'>Male</MenuItem>
            <MenuItem value='Female'>Female</MenuItem>
            <MenuItem value='Other'>Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={inputStyle}>
          <InputLabel sx={{ color: '#ccc' }}>State</InputLabel>
          <Select
            name='state'
            value={details.state}
            onChange={handleDetailChange}
            label='State'
            sx={{ color: '#fff', backgroundColor: '#1e293b' }}
          >
            <MenuItem value=''>Choose...</MenuItem>
            {states.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* OR Divider */}
      {/* <Box sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
        <Divider sx={{ flex: 1, backgroundColor: '#334155' }} />
        <Typography sx={{ mx: 2, color: '#94a3b8' }}>OR</Typography>
        <Divider sx={{ flex: 1, backgroundColor: '#334155' }} />
      </Box> */}

      {/* Select Patient */}
      {/* <FormControl fullWidth sx={{ ...inputStyle, mb: 4 }}>
        <InputLabel sx={{ color: '#ccc' }}>Select Existing Patient</InputLabel>
        <Select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          label="Select Patient"
          sx={{ color: '#fff', backgroundColor: '#1e293b' }}
        >
          <MenuItem value="">Choose...</MenuItem>
          {patients.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {/* Prescription Section */}
      <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
        Prescription
      </Typography>

      <TextField
        multiline
        minRows={4}
        label='Write or edit prescription'
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
        fullWidth
        sx={inputStyle}
        InputLabelProps={{ style: { color: '#ccc' } }}
      />
    </Box>
  );
}

const inputStyle = {
  backgroundColor: '#1e293b',
  borderRadius: 2,
  input: { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#64748b' },
    '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
  },
};
