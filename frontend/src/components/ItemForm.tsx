import React, { FormEvent, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Auth, API } from 'aws-amplify'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useNavigate } from 'react-router-dom'

function generateItemUrl(userID: string, postDate: string) {
  const directURL = '/items/item?user=' + userID + '&post_date=' + postDate
  console.log(directURL)
  return directURL
}

export default function ItemForm() {
  // State tracker for each field
  // postedBy and postedTime will be set automatically on backend
  // photo URL will be assigned once uploaded?
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<null | File>(null)
  const [locations, setLocations] = useState([])
  const [redirect, setRedirect] = useState(false)

  // source: https://aws.plainenglish.io/how-to-create-an-image-uploader-using-aws-cdk-c163277b26f0
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const postItem = async () => {
    const base64Image = await toBase64(image)
    const apiName = 'default'
    const path = 'items'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        title,
        price,
        tags,
        description,
        location,
        imageFile: base64Image,
        imageName: image.name,
      },
    }

    // TODO - add better error handling for unsuccessful post
    try {
      return await API.post(apiName, path, myInit)
    } catch {
      console.error('Error posting item')
    }
  }

  const setFormOptions = async () => {
    const apiName = 'default'
    const path = 'items/locations'
    const myInit = {}
    try {
      const avaliableLocations = await API.get(apiName, path, myInit)
      setLocations(avaliableLocations)
    } catch {
      console.error('Error fetching locations')
    }
  }

  const handleImageInput = (e) => {
    // handle validations
    const file = e.target.files[0]
    console.log(file)
    if (file.size > 3000000) alert('file size cannot exceed 3 MB')
    else if (file.type !== 'image/jpeg') alert('file must be jpg or jpeg')
    else setImage(file)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const response = await postItem()
    console.log(response)
    if (redirect) {
      const itemUrl = generateItemUrl(
        response.Item['UserID'],
        response.Item['PostedDate']
      )
      navigate(itemUrl)
    }
  }

  useEffect(() => {
    setFormOptions()
  }, [])

  console.log(image)

  return (
    <>
      <h1>Post Item for Sale</h1>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            '& > :not(style)': { display: 'flex', maxWidth: '80%', m: 3 },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={redirect}
                onChange={() => setRedirect(!redirect)}
              />
            }
            label='Redirect on Submit'
          />
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
            <Button
              variant='contained'
              color='secondary'
              sx={{ flexGrow: 0.25 }}
            >
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
              type='number'
              id='item-price'
              label='Price'
              value={price}
              variant='outlined'
              sx={{ flexGrow: 1 }}
              InputProps={{ inputProps: { min: 0, step: '0.01' } }}
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
                    <MenuItem key={loc} value={loc}>
                      {loc}
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
            <input
              onChange={(e) => handleImageInput(e)}
              id='item-image'
              type='file'
              hidden
            />
          </Button>
          {image && image.name}
          <Button variant='contained' type='submit' fullWidth sx={{ p: 3 }}>
            Submit
          </Button>
        </Box>
      </form>
    </>
  )
}
