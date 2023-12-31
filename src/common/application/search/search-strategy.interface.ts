import { Result } from "../result-handler/result";
import { SearchResult } from "./search-result.interface";

export interface SearchStrategy {
    search(term: string): Promise<Result<SearchResult  []>>
}