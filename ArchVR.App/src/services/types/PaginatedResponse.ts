export default class PaginatedResponse<T> {
  constructor(
    public items: Array<T>,
    public pageSize: number,
    public page: number,
    public total: number
  ) {}
}
