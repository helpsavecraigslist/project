import React, { useEffect, useState } from 'react'
import { CircularProgress, Grid, TextField, Typography } from '@mui/material'
import ItemCard from './ItemCard'
import { API } from 'aws-amplify'
import { DashboardCustomizeOutlined } from '@mui/icons-material'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

export default function Items() {
  const [dbResponse, setDbResponse] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allTagOptions, setAllTagOptions] = useState([])
  const [tagSearchSelection, setTagSearchSelection] = useState('')

  const fetchItems = async () => {
    const apiName = 'default'
    const path = 'items'
    const myInit = {}
    try {
      const response = await API.get(apiName, path, myInit)
      setDbResponse([...response.Items])
      setLoading(false)
    } catch {
      console.error('Error fetching items')
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

  useEffect(() => {
    fetchItems()
    setTagOptions()
  }, [])

  function generateCards(dbResponse: any) {
    // Filtering happens if a tag is selected from dropdown
    if (tagSearchSelection) {
      let displayItems = dbResponse.filter((item) => {
        return item.Tags.includes(tagSearchSelection)
      })
      if (displayItems.length === 0) {
        return (
          <>
            <Typography variant='h4' sx={{ my: 8 }}>
              No items with this tag.
            </Typography>
          </>
        )
      } else {
        return displayItems.map((obj: any) => (
          <Grid item>
            <ItemCard data={obj}></ItemCard>
          </Grid>
        ))
      }
    } else {
      return dbResponse.map((obj: any) => (
        <Grid item>
          <ItemCard data={obj}></ItemCard>
        </Grid>
      ))
    }
  }

  return (
    <>
      <Grid container sx={{ m: 2 }} alignItems='center'>
        <Grid item xs={12} md={3}>
          <TextField
            id='filter-by-tag'
            select
            fullWidth
            label='Filter by Tag'
            value={tagSearchSelection}
            onChange={(e) => setTagSearchSelection(e.target.value)}
            sx={{ minWidth: 100 }}
            size='small'
          >
            {allTagOptions.map((t) => {
              return (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              )
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            sx={{ mx: 2, p: 1.25 }}
            onClick={() => setTagSearchSelection('')}
          >
            Clear Selections
          </Button>
        </Grid>
      </Grid>
      <Grid container display={'flex'} spacing={3} justifyContent={'center'}>
        {loading && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
        {generateCards(dbResponse)}
      </Grid>
    </>
  )
}
