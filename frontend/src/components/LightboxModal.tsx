import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

function LightboxModalStyles() {
  const theme = useTheme();

  const backdrop = alpha(theme.palette.grey[900], 0.96);

  return (
    <GlobalStyles
      styles={{
        '.yarl__root': {
          '--yarl__color_backdrop': backdrop,
          zIndex: 9999,
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------

export type LightboxModalProps = {
  images: string[];
  photoIndex: number;
  setPhotoIndex: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
  /** Kept for call-site compatibility; the visible slide is `images[photoIndex]`. */
  mainSrc?: string;
  onCloseRequest: () => void;
  animationDuration?: number;
  /** When set (e.g. product carousel), invoked instead of only updating `photoIndex` for prev navigation. */
  onMovePrevRequest?: () => void;
  /** When set (e.g. product carousel), invoked instead of only updating `photoIndex` for next navigation. */
  onMoveNextRequest?: () => void;
};

export default function LightboxModal({
  images,
  photoIndex,
  setPhotoIndex,
  isOpen,
  onCloseRequest,
  animationDuration = 160,
  onMovePrevRequest,
  onMoveNextRequest,
}: LightboxModalProps) {
  const prevIndexRef = useRef(photoIndex);

  useEffect(() => {
    prevIndexRef.current = photoIndex;
  }, [photoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const slides = useMemo(() => images.map((src) => ({ src })), [images]);

  const hasCustomNav = Boolean(onMoveNextRequest || onMovePrevRequest);

  return (
    <>
      <LightboxModalStyles />

      <Lightbox
        open={isOpen}
        close={onCloseRequest}
        index={photoIndex}
        slides={slides}
        animation={{
          fade: animationDuration,
          swipe: animationDuration,
          navigation: animationDuration,
        }}
        plugins={[Counter, Zoom]}
        carousel={{ finite: images.length <= 1 }}
        on={{
          view: ({ index: nextIndex }) => {
            const prev = prevIndexRef.current;
            const n = images.length;
            if (!n || nextIndex === prev) {
              return;
            }

            if (hasCustomNav) {
              const forward = nextIndex === (prev + 1) % n;
              const backward = nextIndex === (prev + n - 1) % n;
              if (forward && onMoveNextRequest) {
                onMoveNextRequest();
              } else if (backward && onMovePrevRequest) {
                onMovePrevRequest();
              } else {
                setPhotoIndex(nextIndex);
              }
            } else {
              setPhotoIndex(nextIndex);
            }
            prevIndexRef.current = nextIndex;
          },
        }}
      />
    </>
  );
}
