import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Divider,
  IconButton,
  IconButtonProps,
  Typography,
  Modal,
  Button,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// @types
import { VisitCardProps } from '../../../@types/user';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
//
import ChatRoomOneParticipant from './ChatRoomOneParticipant';
import ChatRoomGroupParticipant from './ChatRoomGroupParticipant';

// ----------------------------------------------------------------------

const ToggleButtonStyle = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(1),
  boxShadow: theme.customShadows.z8,
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
  borderRight: 0,
  borderRadius: `12px 0 0 12px`,
  transition: theme.transitions.create('all'),
  '&:hover': {
    backgroundColor: theme.palette.background.neutral,
  },
}));

// ----------------------------------------------------------------------

const SIDEBAR_WIDTH = 240;

const AttachmentItemStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PreviewModal = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 900,
  maxHeight: '90vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[24],
  padding: theme.spacing(3),
  outline: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    maxHeight: '95vh',
    padding: theme.spacing(2),
  },
}));

const PreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: '70vh',
  objectFit: 'contain',
  borderRadius: theme.spacing(1),
}));

type ReportItem = {
  _id?: string;
  visit?: string;
  diagnosis?: string;
  vitals?: unknown[];
  doctor_remarks?: string;
  ai_health_analysis?: unknown;
};

type Props = {
  visit: VisitCardProps | null;
  reportList?: ReportItem[];
};

export default function ChatRoom({ visit, reportList = [] }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const [openSidebar, setOpenSidebar] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [selectUser, setSelectUser] = useState<string | null>(null);
  const [showAttachment, setShowAttachment] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const isDesktop = useResponsive('up', 'lg');

  // Get participants from visit data if available
  const participants = visit?.doctor_patient_relations_id
    ? [
        {
          id: visit.doctor_patient_relations_id.doctor_id._id,
          name: `${visit.doctor_patient_relations_id.doctor_id.firstName} ${visit.doctor_patient_relations_id.doctor_id.lastName}`,
          username: visit.doctor_patient_relations_id.doctor_id.email || '',
          avatar: visit.doctor_patient_relations_id.doctor_id.profile_picture,
          status: 'online' as const,
          position: 'Doctor',
        },
        {
          id: visit.doctor_patient_relations_id.patient_id._id,
          name: `${visit.doctor_patient_relations_id.patient_id.firstName} ${visit.doctor_patient_relations_id.patient_id.lastName}`,
          username: visit.doctor_patient_relations_id.patient_id.email || '',
          avatar: '',
          status: 'online' as const,
          position: 'Patient',
        },
      ]
    : [];

  const isGroup = participants.length > 1;

  useEffect(() => {
    if (!isDesktop) {
      return handleCloseSidebar();
    }
    return handleOpenSidebar();
  }, [isDesktop]);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleAddAttachments = () => {
    if (visit?._id) {
      router.push(PATH_DASHBOARD.visits.detailed.replace('[name]', visit._id));
    }
  };

  const getAttachmentUrl = (attachment: any): string => {
    if (!attachment) return '';
    if (typeof attachment === 'string') return attachment;
    return attachment.url || attachment.name || '';
  };

  const attachments = visit?.attachments || [];

  const renderContent = (
    <>
      {isGroup && participants.length > 0 ? (
        <ChatRoomGroupParticipant
          selectUserId={selectUser}
          participants={participants}
          isCollapse={showParticipants}
          onShowPopupUserInfo={(participantId) => setSelectUser(participantId)}
          onCollapse={() => setShowParticipants((prev) => !prev)}
        />
      ) : participants.length > 0 ? (
        <div>
          <ChatRoomOneParticipant
            participants={participants}
            isCollapse={showInfo}
            onCollapse={() => setShowInfo((prev) => !prev)}
          />
        </div>
      ) : null}
      {participants.length > 0 && <Divider />}

      {/* Reports Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1.5, 2),
          }}
        >
          <Typography
            variant='overline'
            sx={{
              color: theme.palette.text.disabled,
              fontWeight: 600,
            }}
          >
            Reports ({reportList.length})
          </Typography>
          <IconButton
            size='small'
            onClick={() => setShowReports((prev) => !prev)}
          >
            <Iconify
              icon={
                showReports
                  ? 'eva:arrow-ios-downward-fill'
                  : 'eva:arrow-ios-forward-fill'
              }
              width={16}
              height={16}
            />
          </IconButton>
        </Box>

        {showReports && (
          <Scrollbar sx={{ flexGrow: 1, maxHeight: 200 }}>
            {reportList.length > 0 ? (
              <List sx={{ px: 1 }}>
                {reportList.map((report, index) => (
                  <AttachmentItemStyle key={report._id || index}>
                    <ListItemAvatar>
                      <Avatar
                        variant='rounded'
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                        }}
                      >
                        <Iconify icon='mdi:file-document-outline' width={24} height={24} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={report.diagnosis || 'Report'}
                      secondary={report.visit ? `Visit` : undefined}
                      primaryTypographyProps={{
                        variant: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        noWrap: true,
                      }}
                    />
                  </AttachmentItemStyle>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 3,
                  px: 2,
                }}
              >
                <Iconify
                  icon='mdi:file-document-outline'
                  width={40}
                  height={40}
                  sx={{ color: 'text.disabled', mb: 1 }}
                />
                <Typography variant='body2' color='text.secondary'>
                  No reports yet
                </Typography>
              </Box>
            )}
          </Scrollbar>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Attachments Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1.5, 2),
          }}
        >
          <Typography
            variant='overline'
            sx={{
              color: theme.palette.text.disabled,
              fontWeight: 600,
            }}
          >
            Attachments ({attachments.length})
          </Typography>
          <IconButton
            size='small'
            onClick={() => setShowAttachment((prev) => !prev)}
          >
            <Iconify
              icon={
                showAttachment
                  ? 'eva:arrow-ios-downward-fill'
                  : 'eva:arrow-ios-forward-fill'
              }
              width={16}
              height={16}
            />
          </IconButton>
        </Box>

        {showAttachment && (
          <>
            <Scrollbar sx={{ flexGrow: 1, maxHeight: 300 }}>
              {attachments.length > 0 ? (
                <List sx={{ px: 1 }}>
                  {attachments
                    .map((att: any) => getAttachmentUrl(att))
                    .filter((url: string) => !!url)
                    .map((url: string, index: number) => (
                      <AttachmentItemStyle
                        key={index}
                        onClick={() => handleImageClick(url)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={url}
                            variant='rounded'
                            sx={{ width: 48, height: 48 }}
                          >
                            <Iconify
                              icon='mdi:file-image'
                              width={24}
                              height={24}
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Attachment ${index + 1}`}
                          secondary={url.split('/').pop() || 'Image'}
                          primaryTypographyProps={{
                            variant: 'body2',
                            noWrap: true,
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            noWrap: true,
                          }}
                        />
                        <Iconify
                          icon='mdi:eye-outline'
                          width={20}
                          height={20}
                          sx={{ color: 'text.secondary', ml: 1 }}
                        />
                      </AttachmentItemStyle>
                    ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    px: 2,
                  }}
                >
                  <Iconify
                    icon='mdi:file-image-outline'
                    width={48}
                    height={48}
                    sx={{ color: 'text.disabled', mb: 1 }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    No attachments available
                  </Typography>
                </Box>
              )}
            </Scrollbar>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ px: 2, pb: 2 }}>
              {attachments.length < 5 ? (
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={
                    <Iconify icon='mdi:plus-circle' width={20} height={20} />
                  }
                  onClick={handleAddAttachments}
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                  }}
                >
                  Add More Attachments
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant='outlined'
                  disabled
                  startIcon={
                    <Iconify icon='mdi:close-circle' width={20} height={20} />
                  }
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    color: 'error.main',
                    borderColor: 'error.main',
                    '&.Mui-disabled': {
                      color: 'error.main',
                      borderColor: 'error.main',
                      opacity: 0.6,
                    },
                  }}
                >
                  Can't add more attachments
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ToggleButtonStyle
          onClick={handleToggleSidebar}
          sx={{
            ...(openSidebar && isDesktop && { right: SIDEBAR_WIDTH }),
          }}
        >
          <Iconify
            width={16}
            height={16}
            icon={
              openSidebar
                ? 'eva:arrow-ios-forward-fill'
                : 'eva:arrow-ios-back-fill'
            }
          />
        </ToggleButtonStyle>

        {isDesktop ? (
          <Drawer
            open={openSidebar}
            anchor='right'
            variant='persistent'
            sx={{
              height: 1,
              width: SIDEBAR_WIDTH,
              transition: theme.transitions.create('width'),
              ...(!openSidebar && { width: '0px' }),
              '& .MuiDrawer-paper': {
                position: 'static',
                width: SIDEBAR_WIDTH,
              },
            }}
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            anchor='right'
            ModalProps={{ keepMounted: true }}
            open={openSidebar}
            onClose={handleCloseSidebar}
            sx={{
              '& .MuiDrawer-paper': {
                width: SIDEBAR_WIDTH,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PreviewModal>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant='h6'>Image Preview</Typography>
            <IconButton onClick={handleClosePreview}>
              <Iconify icon='eva:close-fill' width={24} height={24} />
            </IconButton>
          </Box>
          {previewImage && <PreviewImage src={previewImage} alt='Preview' />}
        </PreviewModal>
      </Modal>
    </>
  );
}
