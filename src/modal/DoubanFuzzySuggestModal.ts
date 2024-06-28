import { App, FuzzySuggestModal, Notice } from "obsidian";
import { SupportType } from "src/enum/constants";
import { SearchService } from "src/service/SearchService";
import { FileWritter } from "src/utils/FileWritter";

export class DoubanFuzzySuggestModal extends FuzzySuggestModal<any> {
    
    private listData: any[];
    type: SupportType;

    onSubmit: (url: string) => void;

    constructor(app: App, listData: any[], type: SupportType) {
        super(app);
        this.listData = listData
        this.type = type
    }

    getItems(): any[] {
        return this.listData
    }

    getItemText(item: any): string {
        let result = item.title
        if (item.rating) {
            result = result + "  评分：" + item.rating
        }
        if (item.abstract) {
            result = result + "\n" + item.abstract
        }
        if (item.actors) {
            result = result + "\n" + item.actors
        }

        return result
    }

    async onChooseItem(item: any, evt: MouseEvent | KeyboardEvent): Promise<void> {
        console.log("选择了" + item.detail_url)
        new Notice("👀读取详情页中..")
		try {
			let result = await new SearchService().getDetail(item.detail_url, this.type)
			await new FileWritter(this.app).writeToFile(this.getSaveFilePath(), `${result.title}.md`, result)
		} catch (e) {
			console.log("err:" + e.message)
			new Notice(e.message);
		}
    }

    getSaveFilePath(): string {
		if (this.type == SupportType.MOVIE) {
			return "Database/Movie"
		}
		if (this.type == SupportType.GAME) {
			return "Database/Game"
		}
		if (this.type == SupportType.BOOK) {
			return "Database/Book"
		}

		return ""
	}
}