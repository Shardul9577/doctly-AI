import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
// @types
import { Conversation, Message } from '../../../@types/chat';
// components
import ChatReport from './ChatReport';
import { VisitCardProps } from 'src/@types/user';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
  conversation: Conversation;
  visit: VisitCardProps | null;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({
  message,
  conversation,
  visit,
  onOpenLightbox,
}: ChatMessageItemProps) {
  const theme = useTheme();
  const sender = conversation.participants.find(
    (participant) => participant.id === message.senderId
  );

  const senderDetails =
    message.senderId === '8864c717-587d-472a-929a-8e5f298024da-0'
      ? { type: 'me' }
      : message.senderId === 'ai-system'
      ? { type: 'ai', name: 'AI Assistant' }
      : { avatar: sender?.avatar, name: sender?.name };

  const isMe = senderDetails.type === 'me';
  const isAI = senderDetails.type === 'ai';
  const isImage = message.contentType === 'image';

  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];
  const { enqueueSnackbar } = useSnackbar();

  // Check if message body is JSON and parse it
  let reportData: any = null;
  const isJson =
    isAI &&
    (() => {
      try {
        reportData = JSON.parse(message.body);
        return true;
      } catch {
        return false;
      }
    })();

  console.log(reportData, 'report data');

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          // ...(isMe && {
          //   ml: 'auto',
          // }),
        }}
      >
        {/* {senderDetails.type !== 'me' && !isAI && (
          <Avatar
            alt={senderDetails.name}
            src={senderDetails.avatar}
            sx={{ width: 32, height: 32 }}
          />
        )} */}

        {/* {isAI && (
          <Box
            sx={{
              minWidth: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            AI
          </Box>
        )} */}

        <Box
          sx={
            {
              // ml: isAI ? 0 : 2,
              // width: '100%',
              // ...(isAI && { maxWidth: '100%' }),
            }
          }
        >
          {isAI && isJson && reportData ? (
            <ChatReport
              reportData={reportData}
              visit={visit}
              createdAt={message.createdAt}
            />
          ) : (
            <ContentStyle
              sx={{
                ...(isMe && {
                  color: 'grey.800',
                  bgcolor: 'primary.lighter',
                }),
                ...(isAI && {
                  maxWidth: '100%',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[100],
                }),
              }}
            >
              {isImage ? (
                <MessageImgStyle
                  alt='attachment'
                  src={message.body}
                  onClick={() => onOpenLightbox(message.body)}
                />
              ) : (
                <Typography variant='body2'>{message.body}</Typography>
              )}
            </ContentStyle>
          )}
        </Box>
      </Box>
    </RootStyle>
  );
}
