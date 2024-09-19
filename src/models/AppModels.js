import { Functions } from "../utils/functions";

export class AppModels {
    static DEFAULT_CACHE_TIME_30_SECONDS = 1000 * 60 * 1;
    static DEFAULT_CACHE_TIME_1_MINUTES = 1000 * 60 * 1;
    static DEFAULT_CACHE_TIME_5_MINUTES = 1000 * 60 * 5;
    static DEFAULT_CACHE_TIME_10_MINUTES = 1000 * 60 * 10;
    static DEFAULT_CACHE_TIME_20_MINUTES = 1000 * 60 * 20;
    static DEFAULT_CACHE_TIME_30_MINUTES = 1000 * 60 * 30;

    /**
     * Default loading info object
     * 
     */
    static defaultLoadingInfo = {
        loading: false,
        loadingMessage: ''
    }
    static defaultChild = {
        names: '',
        disabled:false,
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
export class LoadingInfo{
    loading = false;
    loadingMessage = '';
    constructor(loading=false, loadingMessage=''){
        this.loading = loading;
        this.loadingMessage = loadingMessage;
    }
    static DEFAULT_MESSAGE = new LoadingInfo(false, '')
}

export class HeaderProps{
    constructor(title, logo, menuItems){
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
export class ToastInterpreterModel{
    _toast = null;
    _summary = ''
    _detail = ''
    _severity = ''
    _duration = ''    
    constructor(toast, summary, detail, severity, duration){
        this._toast = toast;
        this._summary = summary;
        this._detail = detail;
        this._severity = severity;
        this._duration = duration;
    }
    set toast(toast){
        this._toast = toast;
    }
    set summary(summary){
        this._summary = summary;
    }
    set detail(detail){
        this._detail = detail;
    }
    set severity(severity){
        this._severity = severity;
    }
    set duration(duration){
        this._duration = duration;
    }       
    get toast(){
        return this._toast;
    }
    get summary(){
        return this._summary;
    }
    get detail(){
        return this._detail;
    }
    get severity(){
        return this._severity;
    }
    get duration(){
        return this._duration;
    }

}


export class ToastRules{
    static info(message){
        return {
            severity: 'info',
            summary: message
        }
    }
    static success(message){
        return {
            severity: 'success',
            summary: message
        }
    }
    static error(message){
        return {
            severity: 'error',
            summary: message
        }
    }
    static showAll(){
        return{
            show500: true,
            show404: true,
            show200: true,
            show401: true,
            show403: true,
            show204: true,
        }
    }
    /**
     * This is a helper function to show only the errors that are not 500
     * @returns 
     */
    static showStandard(){
        return{
            show404: true,
            show200: true,
            show401: true,
            show403: true,
            show204: true,
        }
    }
}