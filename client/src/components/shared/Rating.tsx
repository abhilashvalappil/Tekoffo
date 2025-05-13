// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Rating from '@mui/material/Rating';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import StarIcon from '@mui/icons-material/Star';

// const labels: { [index: number]: string } = {
//   0.5: 'Useless',
//   1: 'Useless+',
//   1.5: 'Poor',
//   2: 'Poor+',
//   2.5: 'Ok',
//   3: 'Ok+',
//   3.5: 'Good',
//   4: 'Good+',
//   4.5: 'Excellent',
//   5: 'Excellent+',
// };

// function getLabelText(value: number) {
//   return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
// }

// const ReviewForm: React.FC = () => {
//   const [rating, setRating] = React.useState<number | null>(null);
//   const [hover, setHover] = React.useState<number>(-1);
//   const [review, setReview] = React.useState<string>('');

//   const handleSubmit = (): void => {
//     console.log('Rating:', rating);
//     console.log('Review:', review);
//     // TODO: send to backend
//   };

//   const handleSkip = (): void => {
//     console.log('User skipped rating and review');
//     // TODO: handle skip logic (e.g., close modal, redirect, etc.)
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 500,
//         mx: 'auto',
//         my: 4,
//         p: 4,
//         borderRadius: 3,
//         boxShadow: 3,
//         bgcolor: 'background.paper',
//         transition: 'box-shadow 0.3s ease-in-out',
//         '&:hover': {
//           boxShadow: 6,
//         },
//       }}
//     >
//       <Typography
//         variant="h6"
//         gutterBottom
//         sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}
//       >
//         Give Your Rating & Review
//       </Typography>

//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
//         <Rating
//           name="hover-feedback"
//           value={rating}
//           precision={0.5}
//           getLabelText={getLabelText}
//           onChange={(_, newValue) => setRating(newValue)}
//           onChangeActive={(_, newHover) => setHover(newHover)}
//           emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
//         />
//         {rating !== null && (
//           <Box sx={{ ml: 2, fontSize: 14 }}>{labels[hover !== -1 ? hover : rating]}</Box>
//         )}
//       </Box>

//       <TextField
//         fullWidth
//         multiline
//         minRows={3}
//         label="Write your review"
//         value={review}
//         onChange={(e) => setReview(e.target.value)}
//         sx={{ mb: 3 }}
//       />

//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <Button
//           variant="outlined"
//           onClick={handleSkip}
//           fullWidth
//           sx={{
//             borderRadius: 2,
//             py: 1.2,
//             fontWeight: 600,
//             transition: 'transform 0.2s ease-in-out',
//             '&:hover': {
//               transform: 'scale(1.02)',
//             },
//           }}
//         >
//           Skip
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={rating === null || review.trim() === ''}
//           fullWidth
//           sx={{
//             borderRadius: 2,
//             py: 1.2,
//             fontWeight: 600,
//             transition: 'transform 0.2s ease-in-out',
//             '&:hover': {
//               transform: 'scale(1.02)',
//             },
//           }}
//         >
//           Submit Review
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ReviewForm;



import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';

const labels: { [index: number]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; review: string }) => void;
};

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = React.useState<number | null>(null);
  const [hover, setHover] = React.useState<number>(-1);
  const [review, setReview] = React.useState<string>('');

  const handleSubmit = () => {
    if (rating !== null && review.trim() !== '') {
      onSubmit({ rating, review });
      handleClose();
    }
  };

  const handleClose = () => {
    setRating(null);
    setHover(-1);
    setReview('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Give Your Rating & Review
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            name="hover-feedback"
            value={rating}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={(_, newValue) => setRating(newValue)}
            onChangeActive={(_, newHover) => setHover(newHover)}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Write your review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Skip
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={rating === null || review.trim() === ''}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;

