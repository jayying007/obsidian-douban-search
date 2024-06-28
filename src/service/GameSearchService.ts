import { SupportType } from "src/enum/constants";
import { AbstractSearchService } from "./SearchFetcherInterface";

export class GameSearchService extends AbstractSearchService {

    support(type: SupportType): boolean {
        return type == SupportType.GAME
    }

    async list(keyword: string): Promise<any[]> {
        const response = await fetch('http://localhost:8085/game/list?key=' + keyword);
        const data = await response.json();

        return data["data"]
    }
    
    async detail(url: string): Promise<any> {
        const response = await fetch('http://localhost:8085/game/detail?url=' + url);
        const data = await response.json();

        return data["data"]
    }
}