"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
var Pagination = /** @class */ (function () {
    function Pagination(_a) {
        var _b = _a.data, data = _b === void 0 ? [] : _b, _c = _a.lazy, lazy = _c === void 0 ? false : _c, total = _a.total, _d = _a.pageSize, pageSize = _d === void 0 ? 10 : _d, _e = _a.rowSize, rowSize = _e === void 0 ? 5 : _e, _f = _a.currentPage, currentPage = _f === void 0 ? 1 : _f, _g = _a.isButtonsMode, isButtonsMode = _g === void 0 ? false : _g, _h = _a.onlyNavButtons, onlyNavButtons = _h === void 0 ? false : _h, onNextClick = _a.onNextClick, onPrevClick = _a.onPrevClick, _j = _a.buttonModeOptions, buttonModeOptions = _j === void 0 ? {
            isSimpleArray: true,
            title: '',
        } : _j, _k = _a.isEnabledDeleteButton, isEnabledDeleteButton = _k === void 0 ? true : _k, getImage = _a.getImage, _l = _a.inlineCustomButtons, inlineCustomButtons = _l === void 0 ? null : _l, _m = _a.onSelect, onSelect = _m === void 0 ? function () { } : _m, _o = _a.format, format = _o === void 0 ? function (item, index) { return "".concat(index + 1, ". ").concat(item); } : _o, _p = _a.header, header = _p === void 0 ? function (currentPage, pageSize, total) {
            return "Items ".concat((currentPage - 1) * pageSize + 1, "-").concat(currentPage * pageSize <= total ? currentPage * pageSize : total, " of ").concat(total);
        } : _p, _q = _a.messages, messages = _q === void 0 ? this.defaultMessages : _q;
        this.defaultMessages = {
            firstPage: "❗️ That's the first page",
            lastPage: "❗️ That's the last page",
            prev: '⬅️',
            next: '➡️',
            delete: '❌',
            indexKey: 'order',
        };
        this.lazy = lazy;
        if (!this.lazy && Array.isArray(data)) {
            this.data = data;
        }
        else if (this.lazy && typeof data === 'function') {
            this.data = data;
        }
        else {
            throw new TypeError("data must be function or array depending on value of lazy");
        }
        this.pageSize = pageSize;
        this.rowSize = rowSize;
        this.currentPage = currentPage;
        this.onSelect = onSelect;
        this.getImage = getImage;
        this.onNextClick = onNextClick;
        this.onPrevClick = onPrevClick;
        this.format = format;
        this.onlyNavButtons = onlyNavButtons;
        this.header = header;
        this.messages = messages;
        this.total = this.lazy ? total !== null && total !== void 0 ? total : Infinity : this.data.length;
        this.totalPages = Math.ceil(this.total / this.pageSize);
        this.currentPage = currentPage && (this.lazy || currentPage < this.totalPages) ? currentPage : 1;
        this.isButtonsMode = isButtonsMode;
        this.isEnabledDeleteButton = isEnabledDeleteButton;
        this.inlineCustomButtons = inlineCustomButtons;
        this.header = header;
        this.onSelect = onSelect;
        this.messages = Object.assign(this.defaultMessages, messages);
        this.buttonModeOptions = Object.assign({
            isSimpleArray: false,
            title: '',
        }, buttonModeOptions);
        if (typeof buttonModeOptions === 'object') {
            if (typeof buttonModeOptions.isSimpleArray !== 'undefined') {
                var isSimpleArray = buttonModeOptions.isSimpleArray;
                this.buttonModeOptions.isSimpleArray = isSimpleArray;
            }
            if (typeof buttonModeOptions.title !== 'undefined') {
                var title = buttonModeOptions.title;
                this.buttonModeOptions.title = title;
            }
        }
        this._callbackStr = Math.random().toString(36).slice(2);
        this.currentItems = [];
    }
    Pagination.prototype.text = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, _a, header, itemsText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        items = [];
                        if (!(false === this.isButtonsMode)) return [3 /*break*/, 4];
                        if (!this.lazy) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.data(this.currentPage, this.pageSize)];
                    case 1:
                        _a.currentItems = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.currentItems = getPageData(this.data, this.currentPage, this.pageSize);
                        _b.label = 3;
                    case 3:
                        items = this.currentItems;
                        _b.label = 4;
                    case 4:
                        header = this.header(this.currentPage, this.pageSize, this.total);
                        itemsText = items.map(this.format).join('\n');
                        return [2 /*return*/, "".concat(header, "\n").concat(itemsText)];
                }
            });
        });
    };
    Pagination.prototype.keyboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyboard, _a, items, row, i, item, button, title, i, currentItem, buttonText, button;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        keyboard = [];
                        if (!this.lazy) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.data(this.currentPage, this.pageSize)];
                    case 1:
                        _a.currentItems = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.currentItems = getPageData(this.data, this.currentPage, this.pageSize);
                        _b.label = 3;
                    case 3:
                        items = this.currentItems;
                        row = [];
                        if (!this.onlyNavButtons) {
                            if (this.isButtonsMode === false) {
                                // Pagination buttons
                                for (i = 0; i < items.length; i++) {
                                    if (0 === i % this.rowSize && row.length) {
                                        keyboard.push(row);
                                        row = [];
                                    }
                                    item = items[i];
                                    if (this.messages.indexKey === 'order') {
                                        ;
                                        item.order = i + 1;
                                    }
                                    button = getButton(item[this.messages.indexKey], "".concat(this._callbackStr, "-").concat(i));
                                    row.push(button);
                                }
                            }
                            else {
                                title = this.buttonModeOptions.title;
                                if (this.buttonModeOptions.isSimpleArray) {
                                    title = 0;
                                }
                                // Pagination buttons
                                for (i = 0; i < items.length; i++) {
                                    if (0 === i % 1 && row.length) {
                                        keyboard.push(row);
                                        row = [];
                                    }
                                    currentItem = items[i];
                                    buttonText = void 0;
                                    if (typeof title === 'function') {
                                        buttonText = title(currentItem, i);
                                    }
                                    else {
                                        buttonText =
                                            typeof currentItem[title] !== 'undefined' &&
                                                (currentItem[title] !== '' ? currentItem[title] : "Element #".concat(i + 1));
                                    }
                                    button = getButton(buttonText, "".concat(this._callbackStr, "-").concat(i));
                                    row.push(button);
                                }
                            }
                        }
                        keyboard.push(row);
                        row = [];
                        // Pagination Controls
                        if (this.totalPages > 1) {
                            row.push(getButton(this.messages.prev, "".concat(this._callbackStr, "-prev")));
                            if (this.isEnabledDeleteButton) {
                                row.push(getButton(this.messages.delete, "".concat(this._callbackStr, "-delete")));
                            }
                            row.push(getButton(this.messages.next, "".concat(this._callbackStr, "-next")));
                            keyboard.push(row);
                        }
                        // If needed add custom buttons
                        if (this.inlineCustomButtons && typeof this.inlineCustomButtons === 'object') {
                            keyboard.push.apply(keyboard, this.inlineCustomButtons);
                        }
                        // Give ready-to-use Telegra Markup object
                        return [2 /*return*/, {
                                reply_markup: { inline_keyboard: keyboard },
                            }];
                }
            });
        });
    };
    Pagination.prototype.images = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, images, i, _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        items = this.currentItems;
                        images = [];
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 6];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _b = (_a = images).push;
                        return [4 /*yield*/, this.getImage(items[i])];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, images];
                }
            });
        });
    };
    Pagination.prototype.handleActions = function (composer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                composer.action(new RegExp(this._callbackStr + '-(.+)'), function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                    var data, text, keyboard, images, _a;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                data = ctx.match[1];
                                _a = data;
                                switch (_a) {
                                    case 'prev': return [3 /*break*/, 1];
                                    case 'next': return [3 /*break*/, 11];
                                    case 'delete': return [3 /*break*/, 21];
                                }
                                return [3 /*break*/, 23];
                            case 1:
                                if (!(this.currentPage <= 1)) return [3 /*break*/, 3];
                                return [4 /*yield*/, ctx.answerCbQuery(this.messages.firstPage)];
                            case 2: return [2 /*return*/, _d.sent()];
                            case 3:
                                this.currentPage = this.currentPage - 1;
                                return [4 /*yield*/, this.text()];
                            case 4:
                                text = _d.sent();
                                return [4 /*yield*/, this.keyboard()];
                            case 5:
                                keyboard = _d.sent();
                                return [4 /*yield*/, this.images()];
                            case 6:
                                images = _d.sent();
                                if (!(this.getImage && images.length !== 0)) return [3 /*break*/, 8];
                                return [4 /*yield*/, ctx.editMessageMedia({ media: { url: images[0] }, type: 'photo', caption: text, parse_mode: 'HTML' }, __assign({}, keyboard))];
                            case 7:
                                _d.sent();
                                return [3 /*break*/, 10];
                            case 8: return [4 /*yield*/, ctx.editMessageText(text, __assign(__assign({}, keyboard), { parse_mode: 'HTML' }))];
                            case 9:
                                _d.sent();
                                _d.label = 10;
                            case 10:
                                (_b = this.onNextClick) === null || _b === void 0 ? void 0 : _b.call(this, this.currentItems[0]);
                                return [3 /*break*/, 24];
                            case 11:
                                if (!(this.currentPage >= this.totalPages)) return [3 /*break*/, 13];
                                return [4 /*yield*/, ctx.answerCbQuery(this.messages.lastPage)];
                            case 12: return [2 /*return*/, _d.sent()];
                            case 13:
                                this.currentPage = this.currentPage + 1;
                                return [4 /*yield*/, this.text()];
                            case 14:
                                text = _d.sent();
                                return [4 /*yield*/, this.keyboard()];
                            case 15:
                                keyboard = _d.sent();
                                return [4 /*yield*/, this.images()];
                            case 16:
                                images = _d.sent();
                                if (!(this.getImage && images.length !== 0)) return [3 /*break*/, 18];
                                return [4 /*yield*/, ctx.editMessageMedia({ media: { url: images[0] }, type: 'photo', caption: text, parse_mode: 'HTML' }, __assign({}, keyboard))];
                            case 17:
                                _d.sent();
                                return [3 /*break*/, 20];
                            case 18: return [4 /*yield*/, ctx.editMessageText(text, __assign(__assign({}, keyboard), { parse_mode: 'HTML' }))];
                            case 19:
                                _d.sent();
                                _d.label = 20;
                            case 20:
                                (_c = this.onPrevClick) === null || _c === void 0 ? void 0 : _c.call(this, this.currentItems[0]);
                                return [3 /*break*/, 24];
                            case 21: return [4 /*yield*/, ctx.deleteMessage()];
                            case 22:
                                _d.sent();
                                return [3 /*break*/, 24];
                            case 23:
                                this.onSelect(this.currentItems[data], parseInt(data) + 1, ctx);
                                _d.label = 24;
                            case 24: return [4 /*yield*/, ctx.answerCbQuery()];
                            case 25: return [2 /*return*/, _d.sent()];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return Pagination;
}());
exports.Pagination = Pagination;
var getPageData = function (data, page, pageSize) { return data.slice((page - 1) * pageSize, page * pageSize); };
var getButton = function (text, callback_data) { return ({ text: text, callback_data: callback_data }); };
