export interface GeneratedListMap {
  // Supplier Code => Product Name => Variation => Quantity
  [key: string]: { [key: string]: { [key: string]: number } };
}

export interface GeneratedList {
  // Supplier Code => Product List (includes formattings\n) free form text
  [key: string]: string;
}

export interface UserGeneratedList {
  user: string;
  datetime: string;
  generatedList: GeneratedList;
}
