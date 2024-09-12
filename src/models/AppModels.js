export class AppModels {

    /**
     * Default loading info object
     * 
     */
    static defaultLoadingInfo = {
        loading: false,
        loadingMessage: ''
    }



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
}

export class HeaderProps{
    constructor(title, logo, menuItems){
        this.title = title;
        this.logo = logo;
        this.menuItems = menuItems;
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