import React, { useState } from 'react'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

export default function ItemForm() {
  // State tracker for each field
  // postedBy and postedTime will be set automatically on backend
  // photo URL will be assigned once uploaded?
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState('')

  // TODO - complete this once db and endpoint created
  // async function postItem() {
  //     const apiName = 'MyApiName';
  //     const path = '/path';
  //     const myInit = {
  //       headers: {
  //         Authorization: `Bearer ${(await Auth.currentSession())
  //           .getIdToken()
  //           .getJwtToken()}`
  //       }
  //     };

  //     // TODO - make sure body is sent over in the right format
  //     const newItem = { title, price, tags, description, location}

  //     // TODO - add error handling for unsuccessful post
  //     // QUESTION - where does the body of the request go in params?
  //     return await API.post(apiName, path, myInit);
  //   }

  // TODO - TEMPORARY, switch out with above when ready
  function postItem() {
    alert(
      `You entered:\n${title}\n${price}\n${description}\n${tags}\n${location}`
    )
  }

  //   TODO - replace this with API call
  const locations = [
    { label: 'San Diego, CA', value: 'San Diego, CA' },
    { label: 'Los Angeles, CA', value: 'Los Angeles, CA' },
    { label: 'Lake Arrowhead, CA', value: 'Lake Arrowhead, CA' },
    { label: 'Crestline, CA', value: 'Crestline, CA' },
    { label: 'Long Beach, CA', value: 'Long Beach, CA' },
  ]

  return (
    <>
      <h1>Post Item for Sale</h1>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { display: 'flex', maxWidth: '80%', m: 3 },
        }}
      >
        <TextField
          required
          id='item-title'
          label='Title'
          variant='outlined'
          sx={{ flexGrow: 1 }}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* TODO - make this into an input where the user can add tags
        one at a time, adding to an array of tags (instead of manually
        separating with commas) */}
        <div>
          <TextField
            required
            id='item-tag'
            label='Tags (separate by commas)'
            variant='outlined'
            sx={{ flexGrow: 1 }}
            onChange={(e) => setTags(e.target.value)}
          />
          {/* TODO - add functionality for auto-generating tags from title */}
          <Button variant='contained' color='secondary' sx={{ flexGrow: 0.25 }}>
            Generate Tags For Me
          </Button>
        </div>
        <div>
          {/* TODO: Add validation so only a number can be input 
            MUI documentation suggests to use TextField instead of 
            type="number" due to usability issues. 
            https://mui.com/material-ui/react-text-field/#type-quot-number-quot */}
          <TextField
            required
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            id='item-price'
            label='Price'
            value={price}
            variant='outlined'
            sx={{ flexGrow: 1 }}
            onChange={(e) => setPrice(e.target.value)}
          />
          <FormControl sx={{ flexGrow: 1 }}>
            <InputLabel id='item-location-label'>Location</InputLabel>
            <Select
              required
              labelId='item-location'
              id='item-location'
              value={location}
              label='Location'
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((loc) => {
                return (
                  <MenuItem key={loc.value} value={loc.value}>
                    {loc.value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
        <TextField
          id='item-description'
          label='Description'
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* TODO - this doesn't do anything currently except open file finder */}
        <Button variant='contained' color='secondary' component='label'>
          Upload Image
          <input id='item-image' type='file' value={image} hidden />
        </Button>
        <Button variant='contained' onClick={postItem} fullWidth sx={{ p: 3 }}>
          Submit
        </Button>
      </Box>
    </>
  )
}
