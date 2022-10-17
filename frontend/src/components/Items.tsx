import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import ItemCard from './ItemCard'
import Box from '@mui/material/Box'
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
      <div>
        <h3>Items Page</h3>
        <Button>Basic/Primary</Button>
        <Button variant='contained'>Contained/Primary</Button>
        <Button variant='outlined'>Outlined/Primary</Button>

        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {/* TODO: Programatically generate the correct number of cards with content from the database */}
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
          <ItemCard></ItemCard>
        </Box>

        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
        <p>More content to test scrolling</p>
      </div>
    </>
  )
}
