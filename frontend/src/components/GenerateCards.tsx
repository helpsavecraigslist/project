import React, { useEffect, useState } from 'react'
import { Grid, Alert, Typography } from '@mui/material'
import ItemCard from './ItemCard'

export default function generateCards(
  dbResponse: any,
  tagSearchSelection: string,
  priceSortSelection: string,
  dateSortSelection: string,
  priceMinSelection: string,
  priceMaxSelection: string
) {
  // Handles re-set (clear all selections button) as well as initial/default page load
  if (
    !tagSearchSelection &&
    !priceSortSelection &&
    !dateSortSelection &&
    !priceMinSelection &&
    !priceMaxSelection
  ) {
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
    // Filter out anything below min price and above max price
    if (priceMinSelection || priceMaxSelection) {
      let maxPrice = Number.MAX_SAFE_INTEGER
      let minPrice = 0
      if (priceMaxSelection) {
        maxPrice = parseFloat(priceMaxSelection)
      }
      if (priceMinSelection) {
        minPrice = parseFloat(priceMinSelection)
      }
      displayItems = displayItems.filter((item) => {
        return (
          parseFloat(item.Price) >= minPrice &&
          parseFloat(item.Price) <= maxPrice
        )
      })
    }
    return displayItems.map((obj: any) => (
      <Grid item>
        <ItemCard data={obj}></ItemCard>
      </Grid>
    ))
  }
}
