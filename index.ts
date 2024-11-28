// @ts-nocheck
import { Context, Telegraf } from 'telegraf'

type PaginationMessageOptions = {
    firstPage?: string // Default: "❗️ That's the first page"
    lastPage?: string // Default: "❗️ That's the last page"
    prev?: string // Default: "⬅️"
    next?: string // Default: "➡️"
    delete?: string // Default: "❌"
    indexKey?: string
}

type ButtonModeOptions<T> = {
    isSimpleArray?: boolean // Default: true
    titleKey?: string | null // Default: null
    title?: string | number | ((currentItem: T, i: number) => string)
}

type DataArrayType<T> = T[]
type DataFunctionType<T> = (currentPage: number, pageSize: number) => Promise<T[]>
type DataType<T> = DataArrayType<T> | DataFunctionType<T>

type InlineCustomButton<T> = { callback_data: string | ((currentItem: T) => string); text: string; hide: boolean }

interface PaginationOptions<T> {
    data: DataType<T> // Array of items to paginate
    header?: (currentPage: number, pageSize: number, total: number) => string
    // Default: "Items ${(currentPage - 1) * pageSize + 1}-${currentPage * pageSize <= total ? currentPage * pageSize : total} of ${total}"
    lazy?: boolean
    total?: number
    currentPage?: number
    format?: (item: T, index: number) => string
    // Default: `${index + 1}. ${item}`
    onNextClick?: (currentItem: T) => void
    onPrevClick?: (currentItem: T) => void
    pageSize?: number // Default: 10
    rowSize?: number // Default: 5 (maximum 8)
    isButtonsMode?: boolean // Default: false
    buttonModeOptions?: ButtonModeOptions<T>
    onlyNavButtons?: boolean
    getImage?: (item: T) => Promise<string>
    // Default: { isSimpleArray: true, titleKey: null }

    isEnabledDeleteButton?: boolean // Default: true
    onSelect?: (item: T, index: number) => void // Default: empty function
    messages?: PaginationMessageOptions // Optional custom messages
    inlineCustomButtons?: InlineCustomButton<T>[][] | null // Default: null
}

export class Pagination<T extends object | { order: number }> {
    private defaultMessages = {
        firstPage: "❗️ That's the first page",
        lastPage: "❗️ That's the last page",
        prev: '⬅️',
        next: '➡️',
        delete: '❌',
        indexKey: 'order',
    }
    private lazy: boolean
    private data: DataType<T>
    private total: number
    private totalPages: number
    private pageSize: number
    private onlyNavButtons: boolean
    private rowSize: number
    private currentPage: number
    private isButtonsMode: boolean
    private buttonModeOptions: ButtonModeOptions<T>
    private isEnabledDeleteButton: boolean
    private getImage: (item: T) => Promise<string>
    private onSelect: (item: T, index: number, ctx: Context) => void
    private onNextClick: (currentItem: T) => void
    private onPrevClick: (currentItem: T) => void
    private messages: PaginationMessageOptions
    private inlineCustomButtons?: InlineCustomButton<T>[][] | null
    private header: (currentPage: number, pageSize: number, total: number) => string
    private format: (item: T, index: number) => string
    private _callbackStr: string
    private currentItems: T[]

    constructor({
        data = [],
        lazy = false,
        total,
        pageSize = 10,
        rowSize = 5,
        currentPage = 1,
        isButtonsMode = false,
        onlyNavButtons = false,
        onNextClick,
        onPrevClick,
        buttonModeOptions = {
            isSimpleArray: true,
            title: '',
        },
        isEnabledDeleteButton = true,
        getImage,
        inlineCustomButtons = null,
        onSelect = () => {},
        format = (item, index) => `${index + 1}. ${item}`,
        header = (currentPage, pageSize, total) =>
            `Items ${(currentPage - 1) * pageSize + 1}-${
                currentPage * pageSize <= total ? currentPage * pageSize : total
            } of ${total}`,
        messages = this.defaultMessages,
    }: PaginationOptions<T>) {
        this.lazy = lazy
        if (!this.lazy && Array.isArray(data)) {
            this.data = data
        } else if (this.lazy && typeof data === 'function') {
            this.data = data
        } else {
            throw new TypeError(`data must be function or array depending on value of lazy`)
        }
        this.pageSize = pageSize
        this.rowSize = rowSize
        this.currentPage = currentPage
        this.onSelect = onSelect
        this.getImage = getImage
        this.onNextClick = onNextClick
        this.onPrevClick = onPrevClick
        this.format = format
        this.onlyNavButtons = onlyNavButtons
        this.header = header
        this.messages = messages
        this.total = this.lazy ? total ?? Infinity : this.data.length
        this.totalPages = Math.ceil(this.total / this.pageSize)
        this.currentPage = currentPage && (this.lazy || currentPage < this.totalPages) ? currentPage : 1
        this.isButtonsMode = isButtonsMode
        this.isEnabledDeleteButton = isEnabledDeleteButton
        this.inlineCustomButtons = inlineCustomButtons
        this.header = header
        this.onSelect = onSelect
        this.messages = Object.assign(this.defaultMessages, messages)
        this.buttonModeOptions = Object.assign(
            {
                isSimpleArray: false,
                title: '',
            },
            buttonModeOptions
        )

        if (typeof buttonModeOptions === 'object') {
            if (typeof buttonModeOptions.isSimpleArray !== 'undefined') {
                const { isSimpleArray } = buttonModeOptions
                this.buttonModeOptions.isSimpleArray = isSimpleArray
            }

            if (typeof buttonModeOptions.title !== 'undefined') {
                const { title } = buttonModeOptions
                this.buttonModeOptions.title = title
            }
        }

        this._callbackStr = Math.random().toString(36).slice(2)

        this.currentItems = []
    }

    async text() {
        let items = []

        if (false === this.isButtonsMode) {
            if (this.lazy) {
                this.currentItems = await (this.data as DataFunctionType<T>)(this.currentPage, this.pageSize)
            } else {
                this.currentItems = getPageData(this.data as DataArrayType<T>, this.currentPage, this.pageSize)
            }

            items = this.currentItems
        }

        const header = this.header(this.currentPage, this.pageSize, this.total)
        const itemsText = items.map(this.format).join('\n')

        return `${header}\n${itemsText}`
    }

    async keyboard() {
        const keyboard = []

        if (this.lazy) {
            this.currentItems = await (this.data as DataFunctionType<T>)(this.currentPage, this.pageSize)
        } else {
            this.currentItems = getPageData(this.data as DataArrayType<T>, this.currentPage, this.pageSize)
        }
        const items = this.currentItems

        let row = []

        if (!this.onlyNavButtons) {
            if (this.isButtonsMode === false) {
                // Pagination buttons
                for (let i = 0; i < items.length; i++) {
                    if (0 === i % this.rowSize && row.length) {
                        keyboard.push(row)
                        row = []
                    }
                    const item = items[i]
                    if (this.messages.indexKey === 'order') {
                        ;(item as { order: number }).order = i + 1
                    }
                    const button = getButton(item[this.messages.indexKey], `${this._callbackStr}-${i}`)
                    row.push(button)
                }
            } else {
                // Need to display the title from an associative array?...
                let { title } = this.buttonModeOptions

                if (this.buttonModeOptions.isSimpleArray) {
                    title = 0
                }

                // Pagination buttons
                for (let i = 0; i < items.length; i++) {
                    if (0 === i % 1 && row.length) {
                        keyboard.push(row)
                        row = []
                    }

                    const currentItem = items[i]
                    let buttonText: string
                    if (typeof title === 'function') {
                        buttonText = title(currentItem, i)
                    } else {
                        buttonText =
                            typeof currentItem[title] !== 'undefined' &&
                            (currentItem[title] !== '' ? currentItem[title] : `Element #${i + 1}`)
                    }

                    const button = getButton(buttonText, `${this._callbackStr}-${i}`)
                    row.push(button)
                }
            }
        }

        keyboard.push(row)
        row = []

        // Pagination Controls
        if (this.totalPages > 1) {
            row.push(getButton(this.messages.prev, `${this._callbackStr}-prev`))
            if (this.isEnabledDeleteButton) {
                row.push(getButton(this.messages.delete, `${this._callbackStr}-delete`))
            }
            row.push(getButton(this.messages.next, `${this._callbackStr}-next`))
            keyboard.push(row)
        }

        // If needed add custom buttons
        if (this.inlineCustomButtons && typeof this.inlineCustomButtons === 'object') {
            keyboard.push(
                ...this.inlineCustomButtons.map((buttonRow) =>
                    buttonRow.map(({ callback_data, hide, text }) => ({
                        hide,
                        text,
                        callback_data: typeof callback_data === 'string' ? callback_data : callback_data(this.currentItems[0]),
                    }))
                )
            )
        }

        // Give ready-to-use Telegra Markup object
        return {
            reply_markup: { inline_keyboard: keyboard },
        }
    }

    async images() {
        const items = this.currentItems
        const images: string[] = []

        for (let i = 0; i < items.length; i++) {
            try {
                images.push(await this.getImage(items[i]))
            } catch (e) {
                console.log(e)
            }
        }

        return images
    }

    async handleActions(composer: Telegraf) {
        composer.action(new RegExp(this._callbackStr + '-(.+)'), async (ctx) => {
            const data = ctx.match[1]
            let text: string
            let keyboard: {
                reply_markup: {
                    inline_keyboard: any[]
                }
            }
            let images: string[]
            switch (data) {
                case 'prev':
                    if (this.currentPage <= 1) {
                        return await ctx.answerCbQuery(this.messages.firstPage)
                    }
                    this.currentPage = this.currentPage - 1
                    text = await this.text()
                    keyboard = await this.keyboard()
                    images = await this.images()
                    if (this.getImage && images.length !== 0) {
                        await ctx.editMessageMedia(
                            { media: { url: images[0] }, type: 'photo', caption: text, parse_mode: 'HTML' },
                            {
                                ...keyboard,
                            }
                        )
                    } else {
                        await ctx.editMessageText(text, {
                            ...keyboard,
                            parse_mode: 'HTML',
                        })
                    }
                    this.onNextClick?.(this.currentItems[0])
                    break
                case 'next':
                    if (this.currentPage >= this.totalPages) {
                        return await ctx.answerCbQuery(this.messages.lastPage)
                    }
                    this.currentPage = this.currentPage + 1
                    text = await this.text()
                    keyboard = await this.keyboard()
                    images = await this.images()
                    if (this.getImage && images.length !== 0) {
                        await ctx.editMessageMedia(
                            { media: { url: images[0] }, type: 'photo', caption: text, parse_mode: 'HTML' },
                            {
                                ...keyboard,
                            }
                        )
                    } else {
                        await ctx.editMessageText(text, {
                            ...keyboard,
                            parse_mode: 'HTML',
                        })
                    }
                    this.onPrevClick?.(this.currentItems[0])
                    break
                case 'delete':
                    await ctx.deleteMessage()
                    break
                default:
                    this.onSelect(this.currentItems[data], parseInt(data) + 1, ctx)
            }
            return await ctx.answerCbQuery()
        })
    }
}

const getPageData = <T>(data: T[], page: number, pageSize: number) => data.slice((page - 1) * pageSize, page * pageSize)

const getButton = (text: string, callback_data: string) => ({ text, callback_data })
