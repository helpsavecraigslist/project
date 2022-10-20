import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import ItemCard from './ItemCard'
import { API } from 'aws-amplify'
import { DashboardCustomizeOutlined } from '@mui/icons-material'

export default function Items() {
  const [dbResponse, setDbResponse] = useState<any[]>([])

  const fetchItems = async () => {
    const apiName = 'default'
    const path = 'items'
    const myInit = {}
    try {
      const response = await API.get(apiName, path, myInit)
      setDbResponse([...response.Items])
    } catch {
      console.error('Error fetching items')
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  function generateCards(dbResponse: any) {
    return dbResponse.map((obj: any) => (
      <Grid item>
        <ItemCard data={obj}></ItemCard>
      </Grid>
    ))
  }

  return (
    <>
      <Grid container display={'flex'} spacing={3} justifyContent={'center'}>
        {generateCards(dbResponse)}
      </Grid>
    </>
  )
}
