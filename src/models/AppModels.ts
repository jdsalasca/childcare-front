import { Functions } from "../utils/functions";

export class AppModels {
    static DEFAULT_CACHE_TIME_30_SECONDS: number = 1000 * 30;
    static DEFAULT_CACHE_TIME_1_MINUTES: number = 1000 * 60 * 1;
    static DEFAULT_CACHE_TIME_5_MINUTES: number = 1000 * 60 * 5;
    static DEFAULT_CACHE_TIME_10_MINUTES: number = 1000 * 60 * 10;
    static DEFAULT_CACHE_TIME_20_MINUTES: number = 1000 * 60 * 20;
    static DEFAULT_CACHE_TIME_30_MINUTES: number = 1000 * 60 * 30;

    static defaultLoadingInfo: { loading: boolean; loadingMessage: string } = {
        loading: false,
        loadingMessage: ''
    };

    static defaultChild: {
        names: string;
        disabled: boolean;
        cash: string;
        check: string;
        date: string;
    } = {
        names: '',
        disabled: false,
        cash: '',
        check: '',
        date: Functions.formatDateToYYYYMMDD(new Date())
    };
}

/**
 * This class represents the loading information for the loaders of the application
 * @property {boolean} loading - Whether the loader is currently loading
 * @property {string} loadingMessage - The message to display while the loader is loading
 */
export class LoadingInfo {
    loading: boolean;
    loadingMessage: string;

    constructor(loading: boolean = false, loadingMessage: string = '') {
        this.loading = loading;
        this.loadingMessage = loadingMessage;
    }

    static DEFAULT_MESSAGE: LoadingInfo = new LoadingInfo(false, '');
}

export class HeaderProps {
    title: string;
    logo: string;
    menuItems: string[];

    constructor(title: string, logo: string, menuItems: string[]) {
        this.title = title;
        this.logo = logo;
        this.menuItems = menuItems;
    }
}

/**
 * This class represents the toast interpreter model
 * @property {Object} _toast - The toast object
 * @property {string} _summary - The summary of the toast message
 * @property {string} _detail - The detail of the toast message
 * @property {string} _severity - The severity of the toast message 
 */
export class ToastInterpreterModel {
    private _toast: any = null; // Adjust type if you know the specific structure
    private _summary: string = '';
    private _detail: string = '';
    private _severity: string = '';
    private _duration: string = '';

    constructor(toast: any, summary: string, detail: string, severity: string, duration: string) {
        this._toast = toast;
        this._summary = summary;
        this._detail = detail;
        this._severity = severity;
        this._duration = duration;
    }

    set toast(toast: any) {
        this._toast = toast;
    }

    set summary(summary: string) {
        this._summary = summary;
    }

    set detail(detail: string) {
        this._detail = detail;
    }

    set severity(severity: string) {
        this._severity = severity;
    }

    set duration(duration: string) {
        this._duration = duration;
    }

    get toast() {
        return this._toast;
    }

    get summary() {
        return this._summary;
    }

    get detail() {
        return this._detail;
    }

    get severity() {
        return this._severity;
    }

    get duration() {
        return this._duration;
    }
}

export class ToastRules {
    static info(message: string) {
        
        return {
            severity: 'info',
            summary: message
        };
    }

    static success(message: string) {
        return {
            severity: 'success',
            summary: message
        };
    }

    static error(message: string) {
        return {
            severity: 'error',
            summary: message
        };
    }

    static showAll() {
        return {
            show500: true,
            show404: true,
            show200: true,
            show401: true,
            show403: true,
            show204: true,
        };
    }

    /**
     * This is a helper function to show only the errors that are not 500
     * @returns 
     */
    static showStandard() {
        return {
            show404: true,
            show200: true,
            show401: true,
            show403: true,
            show204: true,
        };
    }
}
