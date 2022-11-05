import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Chip from '@mui/material/Chip'

function mapTagsToChips(tags: []) {
  return tags.map((obj: string) => (
    <Chip variant='outlined' color='primary' sx={{ m: 0.3 }} label={obj} />
  ))
}

function generateItemUrl(userID: string, postDate: string) {
  const directURL = '/items/item?user=' + userID + '&post_date=' + postDate
  console.log(directURL)
  return directURL
}

// Documentation at: https://mui.com/material-ui/react-card/
export default function MediaCard({ data }: any) {
  const navigate = useNavigate()

  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia
        component='img'
        height='140'
        image={data.ImageUrl}
        alt='green iguana'
      />
      <CardContent sx={{ mb: -2 }}>
        <Typography marginBottom={1} variant='h5' component='div'>
          {data.Title}, ${data.Price}
        </Typography>
        {mapTagsToChips(data.Tags)}
      </CardContent>
      <CardActions sx={{ p: '16px' }}>
        <Button
          size='small'
          variant='contained'
          onClick={() =>
            navigate(generateItemUrl(data.UserID, data.PostedDate))
          }
        >
          View Details
        </Button>
        <Button
          size='small'
          variant='contained'
          onClick={() =>
            navigate('/newMessage', {
              state: { userID: data.UserID, subject: data.Title },
            })
          }
        >
          Message Seller
        </Button>
      </CardActions>
    </Card>
  )
}
