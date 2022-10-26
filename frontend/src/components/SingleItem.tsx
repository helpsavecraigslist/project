import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid } from '@mui/material'
import { Box } from '@mui/material'
import { API } from 'aws-amplify'
import Button from '@mui/material/Button'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

export default function SingleItem() {
  const [params, setParams] = useSearchParams()
  const user = params.get('user')
  const post_date = params.get('post_date')

  const [itemUser, setItemUser] = useState('')
  const [itemTitle, setItemTitle] = useState('')
  const [itemPicture, setItemPicture] = useState('')
  const [itemDate, setItemDate] = useState('')
  const [itemLocation, setItemLocation] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemTags, setItemTags] = useState([])
  const [itemDesc, setItemDesc] = useState('')

  const fetchItem = async () => {
    const apiName = 'default'
    const path = 'items/item'
    const myInit = {
      queryStringParameters: {
        user: user,
        post_date: post_date,
      },
    }
    try {
      const response = await API.get(apiName, path, myInit)
      setItemUser(response.Item.UserID)
      setItemTitle(response.Item.Title)
      setItemPicture(response.Item.Picture)
      setItemDate(response.Item.PostedDate)
      setItemLocation(response.Item.Location)
      setItemPrice(response.Item.Price)
      setItemTags([...response.Item.Tags])
      setItemDesc(response.Item.Description)
    } catch {
      console.error('Error fetching items')
    }
  }

  useEffect(() => {
    fetchItem()
  }, [])

  return (
    <>
      <Grid container spacing={0}>
        {/* Title, Price, and Message Seller button */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            color: 'primary.main',
            backgroundColor: 'secondary.main',
            px: '1rem',
            minHeight: '400px',
          }}
        >
          <Box>
            <Typography variant='h3' sx={{ pt: '1rem' }} gutterBottom>
              {itemTitle}
            </Typography>
          </Box>
          {/* TODO - for onClick pass item seller info here to new message page {itemUser} */}
          <Typography variant='h1' gutterBottom>
            ${itemPrice}
          </Typography>
          <IconButton>
            <ForumRoundedIcon
              sx={{ fontSize: 40, color: 'primary.main' }}
            ></ForumRoundedIcon>
          </IconButton>
          <Typography variant='h5' sx={{ display: 'inline' }}>
            Message Seller
          </Typography>
        </Grid>

        {/* Item Photo */}
        <Grid
          container
          xs={12}
          md={7}
          sx={{
            backgroundColor: 'secondary.light',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component='img'
            sx={{
              width: '100%',
              minHeight: '400px',
              maxHeight: '500px',
              objectFit: 'cover',
            }}
            src={itemPicture}
          ></Box>
        </Grid>

        {/* Item Details */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            color: 'primary.light',
            backgroundColor: 'secondary.light',
            py: '1rem',
            px: '1rem',
            pb: '2rem',
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: '700' }}>
            Item Details
          </Typography>
          <Typography variant='h6'>Location: {itemLocation}</Typography>
          <Typography variant='h6'>Posted On: {itemDate}</Typography>
          <Divider variant='middle' sx={{ my: '1rem' }}></Divider>
          <Typography variant='body1'>{itemDesc}</Typography>
        </Grid>

        {/* Tags - or use this last container for stretch goal such as map integration, etc... */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            color: 'primary.main',
            backgroundColor: 'secondary.main',
            py: '1rem',
            px: '1rem',
          }}
        >
          {itemTags.map((tag) => {
            return (
              <Box sx={{ mb: 2 }}>
                <Button variant='contained'>{tag}</Button>
              </Box>
            )
          })}
        </Grid>
      </Grid>
    </>
  )
}
