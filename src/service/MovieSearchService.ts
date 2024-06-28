import { SupportType } from "src/enum/constants";
import { AbstractSearchService } from "./SearchFetcherInterface";

export class MovieSearchService extends AbstractSearchService {

    support(type: SupportType): boolean {
        return type == SupportType.MOVIE
    }

    async list(keyword: string): Promise<any[]> {
        const response = await fetch('http://localhost:8085/movie/list?key=' + keyword);
        const data = await response.json();

        return data["data"]
    }
    
    async detail(url: string): Promise<any> {
        const response = await fetch('http://localhost:8085/movie/detail?url=' + url);
        let data = await response.json();

        return data["data"]
    }
    
}