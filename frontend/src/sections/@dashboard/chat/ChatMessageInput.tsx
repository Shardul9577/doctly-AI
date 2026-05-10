import { useRef, useState, useEffect, useCallback } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Stack,
  Input,
  Divider,
  IconButton,
  Box,
  Modal,
  Typography,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// utils
import axiosInstance from '../../../utils/axios';
// @types
import { VisitCardProps } from '../../../@types/user';
// components
import Iconify from '../../../components/Iconify';
import { useTheme } from '@mui/material/styles';

type Props = {
  disabled: boolean;
  onSend: (data: {
    visitId: string;
    patientId: string;
    text: string;
    audioFile: Blob | null;
  }) => void;
};

export default function ChatMessageInput({ disabled, onSend }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [message, setMessage] = useState('');
  const [openRecorder, setOpenRecorder] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);
  const [visitData, setVisitData] = useState<VisitCardProps | null>(null);
  const [loading, setLoading] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);
  const theme = useTheme();

  /**
   * Fetches visit data by ID from the URL query
   */
  const fetchVisitData =
    useCallback(async (): Promise<VisitCardProps | null> => {
      if (!id || typeof id !== 'string') {
        return null;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/doctors/visit/${id}`);

        if (res.data.success && res.data.visit) {
          setVisitData(res.data.visit);
          return res.data.visit;
        } else {
          enqueueSnackbar(res.data.message || 'Failed to fetch visit', {
            variant: 'error',
          });
          return null;
        }
      } catch (error: any) {
        console.error('Failed to fetch visit data:', error);
        enqueueSnackbar(
          error?.response?.data?.message || 'Failed to fetch visit',
          {
            variant: 'error',
          }
        );
        setVisitData(null);
        return null;
      } finally {
        setLoading(false);
      }
    }, [id, enqueueSnackbar]);

  // Fetch visit when ID is available
  useEffect(() => {
    if (id) {
      fetchVisitData();
    }
  }, [id, fetchVisitData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startTimer = () => {
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (recordingIntervalRef.current)
      clearInterval(recordingIntervalRef.current);
    setRecordingTime(0);
  };

  const drawVisualizer = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d')!;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = '#f5f5f5';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = '#00c853';
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  const startRecording = async () => {
    audioChunksRef.current = [];

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setAudioBlob(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    document.querySelectorAll('audio').forEach((el) => el.pause());

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.start();
    setRecording(true);
    startTimer();
    drawVisualizer(stream);
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    return new Promise<void>((resolve) => {
      recorder.onstop = () => {
        // Delay a frame to ensure audioChunks is updated
        setTimeout(() => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          // Check if blob has size
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setAudioBlob(blob);
            setAudioURL(url);
          }

          setRecording(false);
          setOpenRecorder(false);
          stopTimer();

          if (animationIdRef.current)
            cancelAnimationFrame(animationIdRef.current);
          audioContextRef.current?.close();

          resolve();
        }, 0); // Give the stack a tick so dataavailable completes
      };

      recorder.stop();
    });
  };

  const handleAudioModalClose = () => {
    if (recording) stopRecording();
    setOpenRecorder(false);
  };

  useEffect(() => {
    if (openRecorder && !recording) {
      startRecording();
    }
  }, [openRecorder]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    // Validate visit_id
    if (!id || typeof id !== 'string') {
      enqueueSnackbar('Visit ID is required', { variant: 'error' });
      return;
    }

    // Validate patient_id
    const patientId = visitData?.doctor_patient_relations_id?.patient_id?._id;
    if (!patientId) {
      enqueueSnackbar('Patient ID is required', { variant: 'error' });
      return;
    }

    // Validate audio file is mandatory
    if (!audioBlob) {
      enqueueSnackbar('Audio file is required', { variant: 'error' });
      return;
    }

    // Get text - use message if available, else empty string
    const text = message.trim() || '';

    // Call onSend with required data
    onSend({
      visitId: id,
      patientId,
      text,
      audioFile: audioBlob,
    });

    // Reset after sending
    setMessage('');
    setAudioBlob(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: 56,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          paddingLeft: 2,
        }}
      >
        <Input
          disabled={disabled}
          fullWidth
          value={message}
          disableUnderline
          onKeyUp={handleKeyUp}
          onChange={(event) => setMessage(event.target.value)}
          placeholder='Type a message'
          endAdornment={
            <Stack direction='row' spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
              <IconButton
                color='primary'
                size='small'
                onClick={() => {
                  if (!audioBlob) setOpenRecorder(true);
                }}
              >
                <Iconify
                  icon='eva:mic-fill'
                  width={22}
                  height={22}
                  color='inherit' // <-- Inherit from IconButton
                />
              </IconButton>
            </Stack>
          }
        />

        <Divider orientation='vertical' flexItem />

        <IconButton
          color='primary'
          disabled={!audioBlob || loading}
          onClick={handleSend}
          sx={{ mx: 1 }}
        >
          <Iconify icon='ic:round-send' width={22} height={22} />
        </IconButton>
      </Box>

      {/* Audio Preview - Only show when recording is stopped */}
      {audioURL && !recording && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: 2,
            p: 2,
            m: 2,
            bgcolor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.grey[100],
            boxShadow: theme.shadows[1],
          }}
        >
          <audio
            controls
            src={audioURL}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              filter:
                theme.palette.mode === 'dark'
                  ? 'invert(1) hue-rotate(180deg)'
                  : 'none',
              borderRadius: 8,
            }}
          />

          <IconButton
            size='small'
            onClick={() => {
              if (audioURL) URL.revokeObjectURL(audioURL);
              setAudioURL(null);
              setAudioBlob(null);
            }}
          >
            <Iconify icon='eva:close-circle-fill' width={24} />
          </IconButton>
        </Box>
      )}

      {/* Audio Recorder Modal */}
      <Modal open={openRecorder} onClose={handleAudioModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            minWidth: 320,
          }}
        >
          <Typography variant='h6' gutterBottom>
            {recording
              ? `Recording... (${formatTime(recordingTime)})`
              : 'Ready to Record'}
          </Typography>

          <canvas
            ref={canvasRef}
            width={280}
            height={60}
            style={{
              background: '#f5f5f5',
              borderRadius: 4,
              marginTop: 16,
              marginBottom: 16,
            }}
          />

          <Stack spacing={2}>
            {recording ? (
              <Button variant='contained' color='error' onClick={stopRecording}>
                Stop
              </Button>
            ) : (
              <Button variant='contained' onClick={startRecording}>
                Start Recording
              </Button>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
