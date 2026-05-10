import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
//
// @mui
import { Box, Divider, Typography, useTheme, alpha } from '@mui/material';
import { keyframes } from '@mui/system';
import { useSnackbar } from 'notistack';
// redux
import { RootState, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Conversation, Message } from '../../../@types/chat';
// utils
import axiosInstance from '../../../utils/axios';
import uuidv4 from '../../../utils/uuidv4';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import { VisitCardProps } from 'src/@types/user';

// ----------------------------------------------------------------------

const conversationSelector = (state: RootState): Conversation => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId
    ? conversations.byId[activeConversationId]
    : null;
  if (conversation) {
    return conversation;
  }
  const initState: Conversation = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: '',
  };
  return initState;
};

export default function ChatWindow({
  visit,
}: {
  visit: VisitCardProps | null;
}) {
  const { pathname } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const conversation = useSelector(conversationSelector);
  const [aiReports, setAiReports] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportList, setReportList] = useState<any[]>([]);

  const patientId = visit?.doctor_patient_relations_id?.patient_id?._id;

  useEffect(() => {
    if (!patientId) {
      setReportList([]);
      return;
    }
    const fetchReports = async () => {
      console.log(patientId, 'patientId');

      try {
        const res = await axiosInstance.get('/api/doctors/visit/report-list', {
          params: { patientId },
        });

        if (res.data?.success && Array.isArray(res.data.reports)) {
          setReportList(res.data.reports);
        } else {
          setReportList([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, [patientId]);

  // Merge conversation messages with AI reports
  const allMessages = [...conversation.messages, ...aiReports];

  // Create a merged conversation object
  const mergedConversation: Conversation = {
    ...conversation,
    messages: allMessages,
  };

  const handleGenerateReport = async (data: {
    visitId: string;
    patientId: string;
    text: string;
    audioFile: Blob | null;
  }) => {
    try {
      setIsGenerating(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('visitId', data.visitId);
      if (data.text) {
        formData.append('text', data.text);
      }

      // Convert Blob to File for proper upload
      if (data.audioFile) {
        const audioFile = new File([data.audioFile], 'audio.webm', {
          type: 'audio/webm',
        });
        formData.append('audioFile', audioFile);
      }

      // Call the API endpoint
      const response = await axiosInstance.post(
        '/api/ai/generate-report',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success && response.data.data) {
        // Format the report data as JSON string for display
        const reportText = JSON.stringify(response.data.data, null, 2);

        // Create a new message for the AI report
        const reportMessage: Message = {
          id: uuidv4(),
          body: reportText,
          contentType: 'text',
          attachments: [],
          createdAt: new Date(),
          senderId: 'ai-system', // Use a special sender ID for AI reports
        };

        // Add the report message to the state
        setAiReports((prev) => [...prev, reportMessage]);

        enqueueSnackbar('Report generated successfully', {
          variant: 'success',
        });
      } else {
        throw new Error(response.data.message || 'Failed to generate report');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to generate report',
        {
          variant: 'error',
        },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyframes animation for loader
  const dashAnimation = keyframes`
    72.5% {
      opacity: 0;
    }
    to {
      stroke-dashoffset: 0;
    }
  `;

  // Breathing/zoom animation
  const breatheAnimation = keyframes`
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  `;

  // Dot breathing animation
  const dotBreatheAnimation = keyframes`
    0%, 100% {
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.8;
    }
  `;

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <ChatHeaderDetail visit={visit} />

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>
            {isGenerating ? (
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  minHeight: '100%',
                  gap: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  overflow: 'hidden',
                }}
              >
                {/* Animated dots background */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gridTemplateRows: 'repeat(8, 1fr)',
                    gap: 3,
                    padding: 6,
                    pointerEvents: 'none',
                  }}
                >
                  {Array.from({ length: 80 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.25),
                        animation: `${dotBreatheAnimation} 2.5s ease-in-out infinite`,
                        animationDelay: `${
                          (index % 10) * 0.15 + Math.floor(index / 10) * 0.1
                        }s`,
                        justifySelf: 'center',
                        alignSelf: 'center',
                      }}
                    />
                  ))}
                </Box>

                <Box
                  component='div'
                  className='loading'
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    animation: `${breatheAnimation} 2s ease-in-out infinite`,
                    '& svg': {
                      width: '192px',
                      height: '144px',
                    },
                    '& svg polyline': {
                      fill: 'none',
                      strokeWidth: 3,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                    },
                    '& svg polyline#back': {
                      fill: 'none',
                      stroke: alpha(theme.palette.primary.main, 0.2),
                    },
                    '& svg polyline#front': {
                      fill: 'none',
                      stroke: theme.palette.primary.main,
                      strokeDasharray: '48, 144',
                      strokeDashoffset: 192,
                      animation: `${dashAnimation} 1.4s linear infinite`,
                    },
                  }}
                >
                  <svg width='192px' height='144px' viewBox='0 0 64 48'>
                    <polyline
                      points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24'
                      id='back'
                    />
                    <polyline
                      points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24'
                      id='front'
                    />
                  </svg>
                </Box>
              </Box>
            ) : (
              <ChatMessageList
                conversation={mergedConversation}
                visit={visit}
              />
            )}
          </Box>

          <Divider />

          <Box sx={{ flexShrink: 0 }}>
            <ChatMessageInput
              onSend={handleGenerateReport}
              disabled={pathname === PATH_DASHBOARD.chat.root || isGenerating}
            />
          </Box>
        </Box>

        {/* {mode === 'DETAIL' && ( */}
        <ChatRoom visit={visit} reportList={reportList} />
        {/* )} */}
      </Box>
    </Box>
  );
}
