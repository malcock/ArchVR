import PaginatedResponse from "~/services/types/PaginatedResponse";
import type { SearchOptions } from "~/services/types/SearchOptions";
type MyFuncType<T> = (input: SearchOptions<T>) => Promise<PaginatedResponse<T>>;

const usePagination = async <T>(fn: MyFuncType<T>) => {
  let baseOptions: SearchOptions<T> = {
    skip: 1,
    sortDirection: "asc",
    take: 10,
  };
  let items: T[] = [];

  let currentPage = 1;

  return {};
};

// export default function<T,K>(fn:(input:(input:T)=>Promise<PaginatedResponse<K>>)){
//   const items:T[] = []
//   return new PaginatedResponse<T>(items,10,1,10)
// }
