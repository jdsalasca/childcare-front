
/**
 * This class contains the models for the layout.
 */
export class LayoutModels{

    static iconModel = {
        label: (
        <div className="logo-container">
          <img src={`${import.meta.env.PUBLIC_URL}/educando_dashboard_logo.png`} alt="Cover" />
        </div>
      ),
      className: 'home-item',
    }
    static homeModel =(handleHomeClick) => { 
      return {
        label: <div onClick={handleHomeClick} className="home-item"><i className="pi pi-home"></i></div>,
        className: 'home-item',
      }
       
    }
    static languageModel =(handleLanguageChange, t) => { 
      return {
        label:  t('language'),
        className: 'c-logout-item',
        items: [
          { label: 'English', command: () => handleLanguageChange('en') },
          { label: 'Español', command: () => handleLanguageChange('es') },
        ]
      }
       
    }

}