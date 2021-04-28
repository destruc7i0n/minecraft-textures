export interface TexturesType {
  comment: string,
  items: Item[]
}

export interface TexturesTypeById {
  comment: string,
  items: {
    [id: string]: {
      readable: string
      texture: string
    }
  }
}

export interface Item {
  readable: string
  id: string
  texture: string
}
