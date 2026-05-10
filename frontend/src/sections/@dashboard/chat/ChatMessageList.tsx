import { useEffect, useState, useRef } from 'react';
import { Typography, Box, useTheme, Paper } from '@mui/material';
import { Conversation } from '../../../@types/chat';
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';
import Iconify from 'src/components/Iconify';
import { VisitCardProps } from 'src/@types/user';

type Props = {
  conversation: Conversation;
  visit: VisitCardProps | null;
};
export default function ChatMessageList({ conversation, visit }: Props) {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  const imagesLightbox = conversation.messages
    .filter((msg) => msg.contentType === 'image')
    .map((msg) => msg.body);

  const handleOpenLightbox = (url: string) => {
    const selected = imagesLightbox.findIndex((item) => item === url);
    setSelectedImage(selected);
    setOpenLightbox(true);
  };

  console.log(visit, 'visit');

  return (
    <>
      {/* <Scrollbar
        scrollableNodeProps={{ ref: scrollRef }}
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: theme.palette.background.default,
        }}
      > */}
      {conversation.messages.length === 0 ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            px: 2,
          }}
        >
          <Iconify
            icon='healthicons:stethoscope-outline'
            width={64}
            height={64}
            color='primary.main'
            style={{ marginBottom: 16 }}
          />

          <Typography
            variant='h2'
            fontWeight={700}
            color='text.primary'
            gutterBottom
          >
            Welcome to Doctly
          </Typography>

          <Typography variant='caption' color='text.secondary' maxWidth={400}>
            Start a conversation to help your patients better. Share reports,
            notes, and treatment insights in one place.
          </Typography>
        </Box>
      ) : (
        conversation.messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            visit={visit}
            onOpenLightbox={handleOpenLightbox}
          />
        ))
      )}
      {/* </Scrollbar> */}

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}
