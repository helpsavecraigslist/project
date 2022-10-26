import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

// TODO - map clicking on tag button to search for other items with that tag
function mapTagsToButtons(tags: []) {
  return tags.map((obj: string) => (
    <Button sx={{ mx: 0.25 }} size='small' variant='contained'>
      {obj}
    </Button>
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
        <Typography gutterBottom variant='h5' component='div'>
          {data.Title}
        </Typography>
        {mapTagsToButtons(data.Tags)}
      </CardContent>
      <CardActions>
        <Button
          onClick={() =>
            navigate(generateItemUrl(data.UserID, data.PostedDate))
          }
        >
          View Details
        </Button>
        <Button
          size='small'
          onClick={() =>
            navigate('/newMessage', {
              state: { userID: data.UserID, subject: data.Subject },
            })
          }
        >
          Message Seller
        </Button>
      </CardActions>
    </Card>
  )
}
