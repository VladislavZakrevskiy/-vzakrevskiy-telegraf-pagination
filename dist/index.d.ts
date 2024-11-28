import { Markup, Telegraf } from 'telegraf';
type PaginationMessageOptions = {
    firstPage?: string;
    lastPage?: string;
    prev?: string;
    next?: string;
    delete?: string;
    indexKey?: string;
};
type ButtonModeOptions<T> = {
    isSimpleArray?: boolean;
    titleKey?: string | null;
    title?: string | number | ((currentItem: T, i: number) => string);
};
type DataArrayType<T> = T[];
type DataFunctionType<T> = (currentPage: number, pageSize: number) => Promise<T[]>;
type DataType<T> = DataArrayType<T> | DataFunctionType<T>;
type InlineCustomButton = ReturnType<typeof Markup.button.callback>;
interface PaginationOptions<T> {
    data: DataType<T>;
    header?: (currentPage: number, pageSize: number, total: number) => string;
    lazy?: boolean;
    total?: number;
    currentPage?: number;
    format?: (item: T, index: number) => string;
    onNextClick?: (currentItem: T) => void;
    onPrevClick?: (currentItem: T) => void;
    pageSize?: number;
    rowSize?: number;
    isButtonsMode?: boolean;
    buttonModeOptions?: ButtonModeOptions<T>;
    onlyNavButtons?: boolean;
    getImage?: (item: T) => Promise<string>;
    isEnabledDeleteButton?: boolean;
    onSelect?: (item: T, index: number) => void;
    messages?: PaginationMessageOptions;
    inlineCustomButtons?: InlineCustomButton[] | null;
}
export declare class Pagination<T extends object | {
    order: number;
}> {
    private defaultMessages;
    private lazy;
    private data;
    private total;
    private totalPages;
    private pageSize;
    private onlyNavButtons;
    private rowSize;
    private currentPage;
    private isButtonsMode;
    private buttonModeOptions;
    private isEnabledDeleteButton;
    private getImage;
    private onSelect;
    private onNextClick;
    private onPrevClick;
    private messages;
    private inlineCustomButtons?;
    private header;
    private format;
    private _callbackStr;
    private currentItems;
    constructor({ data, lazy, total, pageSize, rowSize, currentPage, isButtonsMode, onlyNavButtons, onNextClick, onPrevClick, buttonModeOptions, isEnabledDeleteButton, getImage, inlineCustomButtons, onSelect, format, header, messages, }: PaginationOptions<T>);
    text(): Promise<string>;
    keyboard(): Promise<{
        reply_markup: {
            inline_keyboard: any[];
        };
    }>;
    images(): Promise<string[]>;
    handleActions(composer: Telegraf): Promise<void>;
}
export {};
