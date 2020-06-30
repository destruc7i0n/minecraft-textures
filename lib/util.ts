import { Item } from './types'
/*
'id_in_previous-file': {
  ...'data_to_overwrite_to'...
}
*/

interface Updates {
  [id: string]: {
    id: string
    readable: string
    texture?: string
  }
}

export const updatePropertiesOfItems = (updates: Updates = {}, items: Item[]) => {
  const ids = Object.keys(updates)
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const { id: itemId } = item
    if (itemId && ids.indexOf(itemId) !== -1) {
      // update the object with the updated data
      items[i] = {
        ...items[i],
        ...updates[itemId]
      }
    }
  }
  return items
}