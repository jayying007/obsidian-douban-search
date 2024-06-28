import { SupportType } from "src/enum/constants";

export interface SearchFetcherInterface {

	support(type:SupportType):boolean;

	list(keyword: string): Promise<any[]>;

    detail(url:string): any;

}

export class AbstractSearchService implements SearchFetcherInterface {
	
	support(type: SupportType): boolean {
		throw new Error("Method not implemented.");
	}

	async list(keyword: string): Promise<any[]> {
		throw new Error("Method not implemented.");
	}

	async detail(url: string): Promise<any> {
		throw new Error("Method not implemented.");
	}

}