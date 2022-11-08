import React, { FormEvent, useEffect, useState } from 'react'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
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
import { useNavigate, useSearchParams } from 'react-router-dom'

function generateItemUrl(userID: string, postDate: string) {
  const directURL = '/items/item?user=' + userID + '&post_date=' + postDate
  return directURL
}

export default function EditItemForm() {
  // State tracker for each field
  // postedBy and postedTime will be set automatically on backend
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [allTagOptions, setAllTagOptions] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<null | File>(null)
  const [locations, setLocations] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [originalImage, setOriginalImage] = useState(null)
  const [postedDate, setPostedDate] = useState(null)
  const [originalImagePath, setOriginalImagePath] = useState(null)

  const [params, setParams] = useSearchParams()
  const user = params.get('user')
  const post_date = params.get('post_date')

  // source: https://aws.plainenglish.io/how-to-create-an-image-uploader-using-aws-cdk-c163277b26f0
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const putItem = async () => {
    let tags = mapTagsForSubmit(selectedTags)
    let base64Image
    try {
      base64Image = await toBase64(image)
    } catch {
      base64Image = null
    }
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
        postedDate,
        originalImagePath,
        imageFile: base64Image,
        imageName: image && image.name,
      },
    }

    // TODO - add better error handling for unsuccessful post
    try {
      return await API.put(apiName, path, myInit)
    } catch {
      console.error('Error updating item')
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

  const generateTagsFromTitle = () => {
    const wordsInTitle = title.split(' ')
    const matchedTags = []
    for (const word of wordsInTitle) {
      for (const option of allTagOptions) {
        if (
          selectedTags.find((tag) => {
            return tag.value === option
          })
        ) {
          continue
        }
        const wordsInOption = option.split(' ')
        wordsInOption.push(...option.split('+'))
        if (wordsInOption.includes(word.toLowerCase())) {
          const convertedOption = generateTagFormOptions([option])
          matchedTags.push(...convertedOption)
        }
      }
    }
    setSelectedTags([...selectedTags, ...matchedTags])
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
    const response = await putItem()
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

  const setOriginalPost = async () => {
    const apiName = 'default'
    const path = 'items/item'
    const myInit = {
      queryStringParameters: {
        user: user,
        post_date: post_date,
      },
    }
    const originalPost = await API.get(apiName, path, myInit)
    const item = originalPost['Item']
    setTitle(item['Title'])
    const tags = generateTagFormOptions(item['Tags'])
    setSelectedTags(tags)
    setLocation(item['Location'])
    setPostedDate(item['PostedDate'])
    setOriginalImagePath(item['ImagePath'])
    setPrice(item['Price'])
    setDescription(item['Description'])
    setOriginalImage(item['ImageUrl'])
    setLoading(false)
  }

  useEffect(() => {
    setTagOptions()
    setLocationOptions()
    setOriginalPost()
  }, [])

  if (loading) {
    return (
      <Grid item>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            '& > :not(style)': { display: 'flex', maxWidth: '80%', m: 3 },
          }}
        >
          <Typography variant='h3'>Edit Item</Typography>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MultiSelect
            defaultValue='general'
            placeholder='Select 1 or more tags/categories'
            isMulti
            value={selectedTags}
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
          <Button
            variant='contained'
            color='secondary'
            sx={{ flexGrow: 0.25 }}
            onClick={() => generateTagsFromTitle()}
          >
            Generate Tags For Me
          </Button>
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
          <TextField
            id='item-description'
            label='Description'
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Typography>Original Image</Typography>
          <Box
            component='img'
            sx={{
              height: 233,
              width: 350,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
            }}
            alt='Original Image'
            src={originalImage}
          />
          <Button variant='contained' color='secondary' component='label'>
            Update Image
            <input
              onChange={(e) => handleImageInput(e)}
              id='item-image'
              type='file'
              hidden
            />
          </Button>
          {image && `New image: ${image.name}`}
          <Button variant='contained' type='submit' fullWidth sx={{ p: 3 }}>
            Submit
          </Button>
        </Box>
      </form>
    </>
  )
}
