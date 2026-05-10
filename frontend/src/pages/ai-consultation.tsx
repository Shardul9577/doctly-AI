import { useState, useRef, useEffect } from 'react';
// @mui
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Stack,
  CircularProgress,
  useTheme,
  alpha,
  InputAdornment,
  Link,
} from '@mui/material';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import axiosInstance from '../utils/axios';

// ----------------------------------------------------------------------

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

AiConsultation.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AiConsultation() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/api/ai/consultation', {
        messages: [
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: userMessage.content,
          },
        ],
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.data?.content || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Page title='AI Medical Consultation'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxWidth: '900px',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 4 },
            py: 3,
            pb: 12, // Add padding bottom for fixed input area
          }}
        >
          <Scrollbar
            scrollableNodeProps={{ ref: scrollRef }}
            sx={{
              flexGrow: 1,
              px: { xs: 1, sm: 2 },
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 2,
                  marginTop: '50%',
                }}
              >
                <img
                  src='/Images/logo_single.png'
                  alt='AI Consultation'
                  width={100}
                  height={100}
                />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Start a conversation
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Ask me any medical question, and I'll provide helpful
                  information.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3} sx={{ py: 2, marginTop: '20%' }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems:
                        message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        maxWidth: '75%',
                        px: 3,
                        py: 2,
                        borderRadius: 3,
                        ...(message.role === 'user'
                          ? {
                              bgcolor: alpha(theme.palette.grey[500], 0.15),
                              color: 'text.primary',
                            }
                          : {
                              bgcolor: 'background.paper',
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.5,
                              )}`,
                            }),
                      }}
                    >
                      <Typography
                        variant='body1'
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Paper>
                    {/* Action Icons for AI messages */}
                    {message.role === 'assistant' && (
                      <Stack
                        direction='row'
                        spacing={1}
                        sx={{
                          mt: 1,
                          ml: 1,
                        }}
                      >
                        <IconButton
                          size='small'
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                            },
                          }}
                        >
                          <Iconify
                            icon='eva:bookmark-outline'
                            width={18}
                            height={18}
                          />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                            },
                          }}
                        >
                          <Iconify
                            icon='eva:thumbs-up-outline'
                            width={18}
                            height={18}
                          />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                            },
                          }}
                        >
                          <Iconify
                            icon='eva:thumbs-down-outline'
                            width={18}
                            height={18}
                          />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                            },
                          }}
                        >
                          <Iconify
                            icon='eva:arrow-upward-outline'
                            width={18}
                            height={18}
                          />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                            },
                          }}
                        >
                          <Iconify
                            icon='eva:more-horizontal-outline'
                            width={18}
                            height={18}
                          />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 3,
                        py: 2,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5,
                        )}`,
                      }}
                    >
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <CircularProgress size={16} />
                        <Typography variant='body2' color='text.secondary'>
                          Thinking...
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                )}
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Scrollbar>
        </Box>

        {/* Input Area - Fixed at bottom */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.default',
            pb: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box
            sx={{
              maxWidth: '900px',
              width: '100%',
              px: { xs: 2, sm: 4 },
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder='Ask anything'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              variant='outlined'
              size='small'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:hover': {
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  },
                  '&.Mui-focused': {
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              InputProps={
                {
                  // startAdornment: (
                  //   <InputAdornment position='start'>
                  //     <IconButton
                  //       size='small'
                  //       sx={{
                  //         color: 'text.secondary',
                  //         '&:hover': {
                  //           bgcolor: alpha(theme.palette.grey[500], 0.1),
                  //         },
                  //       }}
                  //     >
                  //       <Iconify icon='eva:plus-outline' width={20} height={20} />
                  //     </IconButton>
                  //   </InputAdornment>
                  // ),
                  // endAdornment: (
                  //   <InputAdornment position='end'>
                  //     <Stack direction='row' spacing={0.5}>
                  //       <IconButton
                  //         size='small'
                  //         sx={{
                  //           color: 'text.secondary',
                  //           '&:hover': {
                  //             bgcolor: alpha(theme.palette.grey[500], 0.1),
                  //           },
                  //         }}
                  //       >
                  //         <Iconify
                  //           icon='eva:mic-outline'
                  //           width={20}
                  //           height={20}
                  //         />
                  //       </IconButton>
                  //       <IconButton
                  //         size='small'
                  //         sx={{
                  //           color: 'text.secondary',
                  //           '&:hover': {
                  //             bgcolor: alpha(theme.palette.grey[500], 0.1),
                  //           },
                  //         }}
                  //       >
                  //         <Iconify
                  //           icon='eva:radio-outline'
                  //           width={20}
                  //           height={20}
                  //         />
                  //       </IconButton>
                  //     </Stack>
                  //   </InputAdornment>
                  // ),
                }
              }
            />
            {/* Disclaimer */}
            <Typography
              variant='caption'
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              AI can make mistakes. Check important info.{' '}
              <Link
                href='#'
                underline='hover'
                sx={{
                  color: 'text.secondary',
                  fontSize: 'inherit',
                }}
              >
                See Cookie Preferences
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}
