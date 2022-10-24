import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

// TODO - map clicking on tag button to search for other items with that tag? Stretch goal?
function mapTagsToButtons(tags: []) {
  return tags.map((obj: string) => (
    <Button sx={{ m: 0.25 }} size='small' variant='contained'>
      {obj}
    </Button>
  ))
}

function generateItemUrl(userID: string, postDate: string) {
  const directURL = '/items/item?user=' + userID + '&post_date=' + postDate
  console.log(directURL)
  return directURL
}

// Adapted from sample code at https://mui.com/material-ui/react-card/
export default function MediaCard({ data }: any) {
  const navigate = useNavigate()

  return (
    <Card sx={{ maxWidth: 345, my: 5 }}>
      <CardMedia
        component='img'
        height='140'
        image='https://picsum.photos/200/300'
        alt='green iguana'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {data.Title}
        </Typography>
        {mapTagsToButtons(data.Tags)}
      </CardContent>
      <CardActions>
        <Button
          size='small'
          onClick={() =>
            navigate(generateItemUrl(data.UserID, data.PostedDate))
          }
        >
          View Details
        </Button>
        <Button size='small'
          onClick={() =>
            navigate('/newMessage') // not sure the data obj has what I; need the user who listed the ad and subject (that's in there!)
          }
        >
          Message Seller
        </Button>
      </CardActions>
    </Card>
  )
}
