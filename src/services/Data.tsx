export interface DataType {
  key: string,
  name: string,
  customer: string,
  quantity: {number: number, detail: string}[],
  done: {number: number, detail: string}[],
  hasImage: boolean,
  image?: string | null,
  price: number,
  description: string,
  delivery: string,
}