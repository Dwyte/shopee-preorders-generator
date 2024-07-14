export interface GeneratedListMap {
  // Supplier Code => Product Name => Variation => Quantity
  [key: string]: { [key: string]: { [key: string]: number } };
}

export interface GeneratedList {
  // Supplier Code => Product List (includes formattings\n) free form text
  [key: string]: string;
}

export interface UserGeneratedList {
  id: string;
  user: string;
  datetime: number;
  generatedList: GeneratedList;
  updateTime?: number;
}

export type MasuerteStallColor =
  | "red"
  | "blue"
  | "yellow"
  | "pink"
  | "violet"
  | "green"
  | "pink";

export interface DTSFileMetadata {
  totalProducts: number;
  totalPreorderProducts: number;
}

export interface BigSellerOrdersMetadata {
  totalOrders: number;
}

export interface UploadedFile extends File {
  downloadURL?: string;
  metadata?: DTSFileMetadata & BigSellerOrdersMetadata;
}

export interface UserSettings {
  id: string;
  user: string;
  supplierCodeMapping?: { [key: string]: string };
  dtsFiles: string[];
  hasNewItemsRecently?: boolean;
  bigSellerCookie: string;
}

export interface LiveNotes {
  id: string;
  user: string;
  datetime: number;
  liveNotes: string;
}
