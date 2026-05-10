import { useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { InputAdornment } from '@mui/material';
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';
import { PATH_DASHBOARD } from '../../../routes/paths';

const InputWrapper = styled('div')({
  width: 280,
});

type Props = {
  onSearch?: (query: string) => void;
};

export default function BlogPostsSearch({ onSearch }: Props) {
  const { push } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = (title: string) => {
    push(PATH_DASHBOARD.blog.view(title));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      handleClick(searchQuery);
    }
  };

  return (
    <InputWrapper>
      <InputStyle
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder='Search post...'
        onKeyUp={handleKeyUp}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Iconify
                icon='eva:search-fill'
                sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
              />
            </InputAdornment>
          ),
        }}
      />
    </InputWrapper>
  );
}
