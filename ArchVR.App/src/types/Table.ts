export interface TableHeading {
  key: string;
  label: string;
  sortable?: boolean;
}
export interface TableField {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string | Array<string>;
}

export interface TableRow {
  _key?: string;
  [key: string]: any;
}
