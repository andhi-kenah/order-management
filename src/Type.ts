export interface DataType {
  key?: string;
  name: string;
  customer: string;
  quantity: {number: number; detail: string}[];
  done: {number: number; detail: string}[];
  hasImage: boolean;
  image?: string | undefined;
  localImage?: string | undefined;
  price: number;
  delivery: string;
  description: string;
  isDone: boolean;
  isUrgent: boolean;
  createdOn: number;
  editedOn: number;
}

export type quantity = {
  number: number;
  detail: string;
};
