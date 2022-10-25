import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid } from '@mui/material'
import { API } from 'aws-amplify'

export default function SingleItem() {
  const [params, setParams] = useSearchParams()
  const user = params.get('user')
  const post_date = params.get('post_date')

  const [itemUser, setItemUser] = useState('')
  const [itemTitle, setItemTitle] = useState('')
  const [itemPicture, setItemPicture] = useState('')
  const [itemDate, setItemDate] = useState('')
  const [itemLocation, setItemLocation] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemTags, setItemTags] = useState([])

  const fetchItem = async () => {
    const apiName = 'default'
    const path = 'items/item'
    const myInit = {
      queryStringParameters: {
        user: user,
        post_date: post_date,
      },
    }
    try {
      const response = await API.get(apiName, path, myInit)
      setItemUser(response.Item.UserID)
      setItemTitle(response.Item.Title)
      setItemPicture(response.Item.ImageUrl)
      setItemDate(response.Item.PostedDate)
      setItemLocation(response.Item.Location)
      setItemPrice(response.Item.Price)
      setItemTags([...response.Item.Tags])
    } catch {
      console.error('Error fetching items')
    }
  }

  useEffect(() => {
    fetchItem()
  }, [])

  return (
    <>
      <h1>{itemTitle}</h1>
      <div>
        <img src={itemPicture}></img> <br></br>
        Date Posted: {itemDate} <br></br>
        Location: {itemLocation} <br></br>
        Price: {itemPrice} <br></br>
        Tags: {itemTags}
        <br></br>
        Posted By: {itemUser}
      </div>
    </>
  )
}
