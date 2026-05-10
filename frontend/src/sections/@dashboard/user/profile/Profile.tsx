// @mui
import { Grid, Stack } from '@mui/material';
// @types
import {
  Profile as UserProfile,
  OrganizationProfile,
  UserPost,
} from '../../../../@types/user';
import ProfileUserCard from './ProfileUserCard';
import ProfilePersonalCard from './ProfilePersonalCard';

// ----------------------------------------------------------------------

type Props = {
  myProfile: UserProfile;
  posts: UserPost[];
};

export default function Profile({ myProfile, posts }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          {/* <ProfileFollowInfo profile={myProfile} /> */}
          <ProfileUserCard profile={myProfile} />
          <ProfilePersonalCard profile={myProfile} />
          {/* <ProfileAbout profile={myProfile} /> */}
          {/* <ProfileSocialInfo profile={myProfile} /> */}
        </Stack>
      </Grid>

      {/* <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <ProfilePostInput />
          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Grid> */}
    </Grid>
  );
}
