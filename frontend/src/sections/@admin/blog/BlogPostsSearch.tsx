// import { useState } from 'react';
// import { paramCase } from 'change-case';
// import parse from 'autosuggest-highlight/parse';
// import match from 'autosuggest-highlight/match';
// import { useRouter } from 'next/router';
// import { styled } from '@mui/material/styles';
// import {
//   Link,
//   Typography,
//   Autocomplete,
//   InputAdornment,
//   Popper,
//   PopperProps,
// } from '@mui/material';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
// import axios from '../../../utils/axios';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// import { Post } from '../../../@types/blog';
// import Image from '../../../components/Image';
// import Iconify from '../../../components/Iconify';
// import InputStyle from '../../../components/InputStyle';
// import SearchNotFound from '../../../components/SearchNotFound';

// const PopperStyle = styled((props: PopperProps) => (
//   <Popper placement='bottom-start' {...props} />
// ))({
//   width: '280px !important',
// });

// type Props = {
//   onSearch?: (query: string) => void;
// };

// export default function BlogPostsSearch({ onSearch }: Props) {
//   const { push } = useRouter();
//   const isMountedRef = useIsMountedRef();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<Post[]>([]);

//   const handleChangeSearch = async (value: string) => {
//     setSearchQuery(value);
//     onSearch?.(value);
//     if (!value) return;
//     try {
//       const response = await axios.get('/api/admin/blogs/search', {
//         params: { query: value },
//       });
//       if (isMountedRef.current) {
//         setSearchResults(response.data.blogs || []);
//       }
//     } catch (error) {
//       setSearchResults([]);
//     }
//   };

//   const handleClick = (title: string) => {
//     push(PATH_DASHBOARD.blog.view(paramCase(title)));
//   };

//   const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') handleClick(searchQuery);
//   };

//   return (
//     <Autocomplete
//       size='small'
//       autoHighlight
//       popupIcon={null}
//       PopperComponent={PopperStyle}
//       options={searchResults}
//       onInputChange={(event, value) => handleChangeSearch(value)}
//       getOptionLabel={(post: Post) => post.title}
//       noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
//       isOptionEqualToValue={(option, value) => option._id === value._id}
//       renderInput={(params) => (
//         <InputStyle
//           {...params}
//           stretchStart={200}
//           placeholder='Search post...'
//           onKeyUp={handleKeyUp}
//           InputProps={{
//             ...params.InputProps,
//             startAdornment: (
//               <InputAdornment position='start'>
//                 <Iconify
//                   icon='eva:search-fill'
//                   sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
//                 />
//               </InputAdornment>
//             ),
//           }}
//         />
//       )}
//       renderOption={(props, post, { inputValue }) => {
//         const matches = match(post.title, inputValue);
//         const parts = parse(post.title, matches);

//         return (
//           <li {...props}>
//             <Image
//               alt={post.title}
//               src={post.image}
//               sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 1,
//                 flexShrink: 0,
//                 mr: 1.5,
//               }}
//             />
//             <Link underline='none' onClick={() => handleClick(post.title)}>
//               {parts.map((part, index) => (
//                 <Typography
//                   key={index}
//                   component='span'
//                   variant='subtitle2'
//                   color={part.highlight ? 'primary' : 'textPrimary'}
//                 >
//                   {part.text}
//                 </Typography>
//               ))}
//             </Link>
//           </li>
//         );
//       }}
//     />
//   );
// }

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
