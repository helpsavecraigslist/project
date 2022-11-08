import React, { useEffect, useState } from 'react'
import { CircularProgress, Grid, TextField, Typography } from '@mui/material'
import ItemCard from './ItemCard'
import { API } from 'aws-amplify'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'

export default function Items() {
  const [dbResponse, setDbResponse] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allTagOptions, setAllTagOptions] = useState([])
  const [tagSearchSelection, setTagSearchSelection] = useState('')
  const [priceSortSelection, setPriceSortSelection] = useState('')
  const [dateSortSelection, setDateSortSelection] = useState('')

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
    // Handles re-set (clear all selections button) as well as initial/default page load
    if (!tagSearchSelection && !priceSortSelection && !dateSortSelection) {
      return dbResponse.map((obj: any) => (
        <Grid item>
          <ItemCard data={obj}></ItemCard>
        </Grid>
      ))
    }
    // Filtering and sorting logic
    else {
      // Deep copy to preserve original db obj
      let displayItems = JSON.parse(
        JSON.stringify(dbResponse)
      ) as typeof dbResponse
      if (tagSearchSelection) {
        displayItems = dbResponse.filter((item) => {
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
        }
      }
      // Cannot sort by price and date at the same time
      if (priceSortSelection) {
        if (!dateSortSelection) {
          if (priceSortSelection === 'Low to High') {
            displayItems.sort((a, b) => a.Price - b.Price)
          } else {
            displayItems.sort((a, b) => b.Price - a.Price)
          }
        } else {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both price and date at the same time. Please clear
              one of these selections and re-try.
            </Alert>
          )
        }
      }
      // Newer (closer to present) date is considered "greater than"
      // Default sort is oldest items first
      // Cannot sort by price and date at the same time
      if (dateSortSelection) {
        if (!priceSortSelection) {
          if (dateSortSelection === 'Oldest First') {
            displayItems.sort((a, b) => (a.PostedDate < b.PostedDate ? -1 : 1))
          } else {
            displayItems.sort((a, b) => (a.PostedDate > b.PostedDate ? -1 : 1))
          }
        } else {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both price and date at the same time. Please clear
              one of these selections and re-try.
            </Alert>
          )
        }
      }
      return displayItems.map((obj: any) => (
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
            id='search-by-tag'
            select
            fullWidth
            label='Search by Tag'
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
          <TextField
            id='sort-by-price'
            select
            fullWidth
            label='Sort by Price'
            value={priceSortSelection}
            onChange={(e) => setPriceSortSelection(e.target.value)}
            sx={{ minWidth: 100 }}
            size='small'
          >
            {['Low to High', 'High to Low', 'None'].map((p) => {
              let val = p
              if (p === 'None') val = ''
              return (
                <MenuItem key={p} value={val}>
                  {p}
                </MenuItem>
              )
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            id='sort-by-date'
            select
            fullWidth
            label='Sort by Date'
            value={dateSortSelection}
            onChange={(e) => setDateSortSelection(e.target.value)}
            sx={{ minWidth: 100 }}
            size='small'
          >
            {['Newest First', 'Oldest First', 'None'].map((d) => {
              let val = d
              if (d === 'None') val = ''
              return (
                <MenuItem key={d} value={val}>
                  {d}
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
            onClick={() => {
              setTagSearchSelection('')
              setPriceSortSelection('')
              setDateSortSelection('')
            }}
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
