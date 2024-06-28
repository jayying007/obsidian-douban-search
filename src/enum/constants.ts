
export enum SupportType {
	MOVIE = 'movie',
	BOOK = 'book',
	GAME = 'game',
}

/**
 * 名称模式选项
 */
// @ts-ignore
export const SearchTypeRecords: { [key in SupportType]: string } = {
	[SupportType.MOVIE]: "影视",
	[SupportType.BOOK]: "书籍",
	[SupportType.GAME]: "游戏",
}