import { App, Editor, FileManager, MarkdownView, Modal, Notice, Platform, Plugin, PluginSettingTab, Setting, normalizePath } from 'obsidian';
import { DoubanSearchModal } from "./modal/DoubanSearchModal";
import { SupportType } from './enum/constants';
import { SearchService } from './service/SearchService';
import { DoubanFuzzySuggestModal } from './modal/DoubanFuzzySuggestModal';

export default class MyPlugin extends Plugin {
	type: SupportType;

	async onload() {
		// Cmd+P
		this.addCommand({
			id: 'search-douban',
			name: '搜索豆瓣并创建文档',
			callback: () => {
			  	new DoubanSearchModal(this.app, this.onSearchKeyword).open();
			}
		});
	}

	// 搜索豆瓣关键词
	async onSearchKeyword(keyword: string, type: SupportType) {
		this.type = type;
		new Notice("🔍搜索关键词中..")
		try {
			let result = await new SearchService().getList(keyword, type)
			new DoubanFuzzySuggestModal(this.app, result, type).open();
		} catch (e) {
			console.log("err:" + e.message)
			new Notice(e.message);
		}
	};

}
