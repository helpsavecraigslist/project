import React from 'react'
import NavBar from './NavBar'
import { Toolbar, Button } from '@mui/material'
import ItemCard from './ItemCard'
import Box, { BoxProps } from '@mui/material/Box'

export default function Items() {
  return (
    <>
      <NavBar />
      {/* Empty toolbar to offset content so it's not covered by app bar */}
      <Toolbar />

      <div>
        <h3>Items Page</h3>
        <Button>Basic/Primary</Button>
        <Button variant="contained">Contained/Primary</Button>
        <Button variant="outlined">Outlined/Primary</Button>

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
