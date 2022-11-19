import React, { useEffect, useState } from 'react'
import { CircularProgress, Grid, TextField } from '@mui/material'
import { API } from 'aws-amplify'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import generateCards from './GenerateCards'

export default function Items() {
  const [dbResponse, setDbResponse] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allTagOptions, setAllTagOptions] = useState([])
  const [allLocationOptions, setAllLocationOptions] = useState([])
  const [tagSearchSelection, setTagSearchSelection] = useState('')
  const [locationSearchSelection, setLocationSearchSelection] = useState('')
  const [priceSortSelection, setPriceSortSelection] = useState('')
  const [dateSortSelection, setDateSortSelection] = useState('')
  const [priceMinSelection, setPriceMinSelection] = useState('')
  const [priceMaxSelection, setPriceMaxSelection] = useState('')
  const [searchString, setSearchString] = useState('')
  const [searchReady, setSearchReady] = useState(false)

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

  const setLocationOptions = async () => {
    const apiName = 'default'
    const path = 'items/locations'
    const myInit = {}
    try {
      const avaliableLocations = await API.get(apiName, path, myInit)
      setAllLocationOptions(avaliableLocations)
    } catch {
      console.error('Error fetching locations: ')
    }
  }

  useEffect(() => {
    fetchItems()
    setTagOptions()
    setLocationOptions()
  }, [])

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
            sx={{ minWidth: 100, mb: 1 }}
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
            id='search-by-tag'
            select
            fullWidth
            label='Search by Location'
            value={locationSearchSelection}
            onChange={(e) => setLocationSearchSelection(e.target.value)}
            sx={{ minWidth: 100, mb: 1 }}
            size='small'
          >
            {allLocationOptions.map((t) => {
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
            sx={{ minWidth: 100, mb: 1 }}
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
            sx={{ minWidth: 100, mb: 1 }}
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
        <Grid item xs={12} md={2}>
          <TextField
            type='number'
            id='min-price'
            label='Min. Price'
            value={priceMinSelection}
            variant='outlined'
            fullWidth
            size='small'
            InputProps={{ inputProps: { min: 0, step: '0.01' } }}
            onChange={(e) => setPriceMinSelection(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            type='number'
            id='max-price'
            label='Max Price'
            value={priceMaxSelection}
            variant='outlined'
            fullWidth
            size='small'
            InputProps={{ inputProps: { min: 0, step: '0.01' } }}
            onChange={(e) => setPriceMaxSelection(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            id='search-titles'
            label='Search Item Titles'
            type='search'
            fullWidth
            size='small'
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            sx={{ mx: 1.5, p: 1.25, mb: 1 }}
            onClick={() => {
              setSearchReady(true)
            }}
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            fullWidth
            sx={{ p: 1.25, mb: 1 }}
            onClick={() => {
              setTagSearchSelection('')
              setLocationSearchSelection('')
              setPriceSortSelection('')
              setDateSortSelection('')
              setPriceMinSelection('')
              setPriceMaxSelection('')
              setSearchString('')
              setSearchReady(false)
            }}
          >
            Reset All
          </Button>
        </Grid>
      </Grid>
      <Grid container display={'flex'} spacing={3} justifyContent={'center'}>
        {loading && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
        {generateCards(
          dbResponse,
          tagSearchSelection,
          priceSortSelection,
          dateSortSelection,
          locationSearchSelection,
          priceMinSelection,
          priceMaxSelection,
          searchString,
          searchReady
        )}
      </Grid>
    </>
  )
}
