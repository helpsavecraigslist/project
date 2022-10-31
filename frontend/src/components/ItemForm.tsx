import React, { FormEvent, useEffect, useState } from 'react'
import { Button, Typography } from '@mui/material'
import { Auth, API } from 'aws-amplify'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MultiSelect from 'react-select'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useNavigate } from 'react-router-dom'

function generateItemUrl(userID: string, postDate: string) {
  const directURL = '/items/item?user=' + userID + '&post_date=' + postDate
  return directURL
}

export default function ItemForm() {
  // State tracker for each field
  // postedBy and postedTime will be set automatically on backend
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [allTagOptions, setAllTagOptions] = useState([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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
    let tags = mapTagsForSubmit(selectedTags)
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

  const setLocationOptions = async () => {
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

  const setTagOptions = async () => {
    const apiName = 'default'
    const path = 'items/tags'
    const myInit = {}
    try {
      const avaliableTags = await API.get(apiName, path, myInit)
      setAllTagOptions(avaliableTags)
    } catch {
      console.error('Error fetching tags: ')
    }
  }

  function mapTagsForSubmit(tagsFinal: any[]) {
    // Selected tags array will be in format [ {value: x, label: y}]
    // due to how react-select works so we need to extract just the value
    // to push to the backend
    let tagValuesOnly = Array()
    for (let t of tagsFinal) {
      tagValuesOnly.push(t.value)
    }
    let tagsStringified = tagValuesOnly.join(',')
    return tagsStringified
  }

  const handleImageInput = (e) => {
    // handle validations
    const file = e.target.files[0]
    if (file.size > 3000000) alert('file size cannot exceed 3 MB')
    else if (file.type !== 'image/jpeg') alert('file must be jpg or jpeg')
    else setImage(file)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const response = await postItem()
    if (redirect) {
      const itemUrl = generateItemUrl(
        response.Item['UserID'],
        response.Item['PostedDate']
      )
      navigate(itemUrl)
    }
  }

  // Format tag options the way react-select needs them
  function generateTagFormOptions(tagArr: any[]) {
    let tagFormOptions = Array()
    tagArr.map((t) => tagFormOptions.push({ value: t, label: t }))
    return tagFormOptions
  }

  // For styling react-select dropdown
  const styles = {
    control: (base) => ({
      ...base,
      flexGrow: 1,
      minHeight: '60px',
    }),
  }

  useEffect(() => {
    setLocationOptions()
    setTagOptions()
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            '& > :not(style)': { display: 'flex', maxWidth: '80%', m: 3 },
          }}
        >
          <Typography variant='h3'>Post Item for Sale</Typography>
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
          <MultiSelect
            defaultValue='general'
            placeholder='Select 1 or more tags/categories'
            isMulti
            onChange={(e) => {
              setSelectedTags([...e])
            }}
            name='tags'
            options={generateTagFormOptions(allTagOptions)}
            className='basic-multi-select'
            classNamePrefix='select'
            menuPortalTarget={document.querySelector('body')}
            styles={styles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 3,
              colors: {
                ...theme.colors,
                primary25: '#D8CDE2',
                primary: '#313131',
                neutral10: '#D8CDE2',
              },
            })}
          />
          {/* TODO - add functionality for auto-generating tags from title */}
          <Button variant='contained' color='secondary' sx={{ flexGrow: 0.25 }}>
            Generate Tags For Me
          </Button>
          <div>
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
