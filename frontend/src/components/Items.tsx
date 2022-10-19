import React, { useEffect } from 'react'
import { Grid } from '@mui/material'
import ItemCard from './ItemCard'
import { API } from 'aws-amplify'

export default function Items() {
  const fetchItems = async () => {
    const apiName = 'default'
    const path = 'items'
    const myInit = {}
    try {
      const response = await API.get(apiName, path, myInit)
      console.log(response)
    } catch {
      console.error('Error fetching items')
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])
  return (
    <>
      <Grid container display={'flex'} spacing={3} justifyContent={'center'}>
        {/* TODO: Programatically generate the correct number of cards with content from the database */}
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
        <Grid item>
          <ItemCard></ItemCard>
        </Grid>
      </Grid>
    </>
  )
}
