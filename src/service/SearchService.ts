import { SupportType } from "src/enum/constants";
import { BookSearchService } from "./BookSearchService";
import { MovieSearchService } from "./MovieSearchService";
import { GameSearchService } from "./GameSearchService";
import { SearchFetcherInterface } from "./SearchFetcherInterface";
import { Notice } from "obsidian";

export class SearchService {

    private fetchers:SearchFetcherInterface[] = [];

	constructor() {
		this.fetchers.push(new BookSearchService());
		this.fetchers.push(new MovieSearchService());
		this.fetchers.push(new GameSearchService());
	}

    /*
        [
            {
                "title": "xxx",
                "rating": "9.3",
                "tag": "xx/yy/zz",
                "image_url": "http://xxx.jpg",
                "detail_url": "http://yyy.com"
            }
        ]
    */
    async getList(keyword: string, type: SupportType): Promise<any[]> {
        console.log(`search list:${keyword}  type:${type}`)
        let result = await this.findFetcher(type).list(keyword)
        console.log(result)
        
        if (result == null) {
            new Notice("关键词，找不到结果")
        }

        return result
    }

    /*
        {
            "title": "xxx",
            "rating": "9.3"
        }
    */
    async getDetail(url: string, type: SupportType): Promise<any> {
        console.log("search detail:" + url + "  " + "type:" + type)
        let result =  await this.findFetcher(type).detail(url)
        console.log(result)

        if (result == null) {
            new Notice("详情页，找不到结果")
        }

        this.map(result, "主演", "actors")
        this.map(result, "导演", "director")
        this.map(result, "作者", "author")
        this.map(result, "类型", "type")
        this.map(result, "首播", "publish_date")
        this.map(result, "出版年", "publish_date")
        this.map(result, "上映日期", "publish_date")
        this.map(result, "发行日期", "publish_date")
        this.map(result, "制片国家/地区", "country")
        this.map(result, "平台", "platform")
        this.map(result, "开发商", "developer")
        result["detail_url"] = url
        if (type == SupportType.MOVIE) {
            result["tags"] = "Movie"
        } else if (type == SupportType.BOOK) {
            result["tags"] = "Book"
        } else if (type == SupportType.GAME) {
            result["tags"] = "Game"
        }

        return result
    }

    findFetcher(type: SupportType): SearchFetcherInterface {
        for (const fetcher of this.fetchers) {
			if (fetcher.support(type)) {
				return fetcher;
			}
		}
		throw new Error(`not support type:${type}`)
    }

    map(data: any, oldKey: string, newKey: string) {
		if (data[oldKey]) {
			data[newKey] = data[oldKey]
		}
	}
}