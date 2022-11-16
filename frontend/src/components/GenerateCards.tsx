import React, { useEffect, useState } from 'react'
import { Grid, Alert, Typography } from '@mui/material'
import ItemCard from './ItemCard'

function applyFilters(
  dbResponse: any,
  tagSearchSelection: string,
  priceSortSelection: string,
  dateSortSelection: string,
  priceMinSelection: string,
  priceMaxSelection: string,
  searchString: string,
  searchReady: boolean
) {
  // Handles re-set (clear all selections button) as well as initial/default page load
  if (
    !tagSearchSelection &&
    !priceSortSelection &&
    !dateSortSelection &&
    !priceMinSelection &&
    !priceMaxSelection &&
    !searchString &&
    !searchReady
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
    // Cannot sort by price when searching title (sorted by relevance)
    if (priceSortSelection) {
      if (!dateSortSelection && !searchString) {
        if (priceSortSelection === 'Low to High') {
          displayItems.sort((a, b) => a.Price - b.Price)
        } else {
          displayItems.sort((a, b) => b.Price - a.Price)
        }
      } else {
        if (dateSortSelection) {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both price and date at the same time. Please clear
              one of these selections and re-try.
            </Alert>
          )
        }
        if (searchString) {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both price and by search terms (by search
              relevance) at the same time. Please clear one of these selections
              and re-try.
            </Alert>
          )
        }
      }
    }
    // Newer (closer to present) date is considered "greater than"
    // Default sort is oldest items first
    // Cannot sort by price and date at the same time
    // Cannot sort by date when searching title (sorted by relevance)
    if (dateSortSelection) {
      if (!priceSortSelection && !searchString) {
        if (dateSortSelection === 'Oldest First') {
          displayItems.sort((a, b) => (a.PostedDate < b.PostedDate ? -1 : 1))
        } else {
          displayItems.sort((a, b) => (a.PostedDate > b.PostedDate ? -1 : 1))
        }
      } else {
        if (priceSortSelection) {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both price and date at the same time. Please clear
              one of these selections and re-try.
            </Alert>
          )
        }
        if (searchString) {
          return (
            <Alert severity='error' sx={{ m: 4, p: 3 }}>
              Cannot sort by both date and by search terms (by search relevance)
              at the same time. Please clear one of these selections and re-try.
            </Alert>
          )
        }
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
    // lastly, search the titles of these filtered-down results
    if (searchReady) {
      displayItems = searchTitles(searchString, displayItems)
    }
    return displayItems.map((obj: any) => (
      <Grid item>
        <ItemCard data={obj}></ItemCard>
      </Grid>
    ))
  }
}

function searchTitles(searchString: string, itemsToSearch: any) {
  let searchTerms = searchString.trim().split(' ')
  // If extra spaces are included between words they get picked up
  // as '' and added to the searchTerms array, delete these
  searchTerms = searchTerms.filter((st) => {
    return st.length !== 0
  })

  // Define the interface for our objects
  type ScoredResults = {
    item: any
    relevanceScore: number
  }
  let searchResults = Array()
  let duplicateItemCheck = Array()
  let scoredResults: { [title: string]: ScoredResults } = {}
  let scoredResultsArr = Array()

  for (const term in searchTerms) {
    for (const item in itemsToSearch) {
      if (
        itemsToSearch[item].Title.toLowerCase().includes(
          searchTerms[term].toLowerCase()
        )
      ) {
        if (!duplicateItemCheck.includes(itemsToSearch[item])) {
          duplicateItemCheck.push(itemsToSearch[item])
          // First time it is found, set up with rel. score of 1
          // Include PostedDate in key so that items with the same title aren't
          // incorrectly flagged as duplicates
          scoredResults[
            itemsToSearch[item].Title + '_' + itemsToSearch[item].PostedDate
          ] = {
            item: itemsToSearch[item],
            relevanceScore: 1,
          }
        } else {
          let newRelevanceScore =
            scoredResults[
              itemsToSearch[item].Title + '_' + itemsToSearch[item].PostedDate
            ].relevanceScore + 1
          scoredResults[
            itemsToSearch[item].Title + '_' + itemsToSearch[item].PostedDate
          ] = {
            item: itemsToSearch[item],
            relevanceScore: newRelevanceScore,
          }
        }
      }
    }
  }
  // Turn into an array so we can use .sort()
  for (let s in scoredResults) {
    scoredResultsArr.push(scoredResults[s])
  }
  // Sort by relevance (highest relevance score)
  scoredResultsArr.sort((a, b) => b.relevanceScore - a.relevanceScore)
  // Strip out the relevance score before returning results
  for (let r in scoredResultsArr) {
    searchResults.push(scoredResultsArr[r].item)
  }
  return searchResults
}

export default function generateCards(
  dbResponse: any,
  tagSearchSelection: string,
  priceSortSelection: string,
  dateSortSelection: string,
  priceMinSelection: string,
  priceMaxSelection: string,
  searchString: string,
  searchReady: boolean
) {
  return applyFilters(
    dbResponse,
    tagSearchSelection,
    priceSortSelection,
    dateSortSelection,
    priceMinSelection,
    priceMaxSelection,
    searchString,
    searchReady
  )
}
