import { App, Modal, Setting } from "obsidian";
import { ButtonComponent, DropdownComponent, TextComponent} from "obsidian";
import { SearchTypeRecords, SupportType} from "../enum/constants";

export class DoubanSearchModal extends Modal {
  
    searchTerm: string;
	searchType: SupportType = SupportType.MOVIE;

    onSubmit: (searchTerm: string, searchType: SupportType) => void;

    constructor(app: App, onSubmit: (searchTerm: string, searchType: SupportType) => void) {
        super(app);
        this.onSubmit = onSubmit;
        console.log(onSubmit)
    }

    async onOpen() {
        let {contentEl} = this;

        contentEl.createEl("h3", {text: "搜索"});
        
        const content = contentEl.createDiv("content");

        // 搜索框
        const inputs = content.createDiv("inputs");
        const searchInput = new TextComponent(inputs).onChange((searchTerm) => {
            this.searchTerm = searchTerm;
        });
        inputs.addClass("obsidian_douban_search_input_content");
        searchInput.inputEl.size = 40;

        searchInput.inputEl.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                sleep(1000);
                this.close();
                this.onSubmit(this.searchTerm, this.searchType);
            }
        });
        inputs.addClass("obsidian_douban_search_input")

        // 搜索选项
        const typeSelect = content.createDiv("type-select");
        const typeSelectInput = new DropdownComponent(typeSelect)
            .addOptions(SearchTypeRecords)
            .setValue(SupportType.MOVIE)
            .onChange((value:SupportType) => {
            this.searchType = value;
        });
        typeSelect.addClass('obsidian_douban_search_input_type');

        // 取消/确认按钮
        const controls = contentEl.createDiv("controls");
        controls.addClass("obsidian_douban_search_controls")
        new ButtonComponent(controls)
            .setButtonText("确认")
            .setCta()
            .onClick(() => {
                this.close();
                this.onSubmit(this.searchTerm, this.searchType);
            }).setClass( "obsidian_douban_search_button");
        new ButtonComponent(controls)
            .setButtonText("取消")
            .onClick(() => {
                this.close();
            }).setClass( "obsidian_douban_cancel_button");
    }

    async onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}