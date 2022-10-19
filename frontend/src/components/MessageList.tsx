import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import MessageItem from './MessageItem'
import Box from '@mui/material/Box'
import { API } from 'aws-amplify'

export default function MessageList() {
  const fetchMessageList = async () => {
    const apiName = 'default'
    const path = 'messages'
    const myInit = {}
    try {
      const response = await API.get(apiName, path, myInit)
      console.log(response)
    } catch {
      console.error('Error fetching messages')
    }
  }

  useEffect(() => {
    fetchMessageList()
  }, [])
  return (
    <>
      <div>
        <h3>Messages Inbox</h3>

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
          <MessageItem></MessageItem>
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
