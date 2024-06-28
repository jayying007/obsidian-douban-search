import { SupportType } from "src/enum/constants";
import { AbstractSearchService } from "./SearchFetcherInterface";

export class BookSearchService extends AbstractSearchService {

    support(type: SupportType): boolean {
        return type == SupportType.BOOK
    }

    async list(keyword: string): Promise<any[]> {
        const response = await fetch('http://localhost:8085/book/list?key=' + keyword);
        const data = await response.json();

        return data["data"]
    }
    
    async detail(url: string): Promise<any> {
        const response = await fetch('http://localhost:8085/book/detail?url=' + url);
        const data = await response.json();

        return data["data"]
    }
    
}