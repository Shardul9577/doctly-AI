import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

type MyAvatarProps = AvatarProps & {
  photo?: string;
};

export default function MyAvatar({ photo, src, ...other }: MyAvatarProps) {
  const { user } = useAuth() as { user?: { displayName?: string; photoURL?: string } };
  const displayName = user?.displayName ?? '';

  return (
    <Avatar
      src={photo ?? src}
      alt={displayName}
      color={user?.photoURL ? 'default' : createAvatar(displayName).color}
      {...other}
    >
      {createAvatar(displayName).name}
    </Avatar>
  );
}
