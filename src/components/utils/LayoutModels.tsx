import { MenuItem } from 'primereact/menuitem';

/**
 * This class contains the models for the layout.
 */
export class LayoutModels {
  static iconModel: MenuItem = {
    template: (
      <div className='logo-container'>
        <img
          src={'/childadmin/admin/educando_dashboard_logo.png'}
          style={{ alignSelf: 'flex-start' }}
          alt='Cover'
        />
      </div>
    ),
    className: 'home-item',
  };
  static homeModel = (handleHomeClick: () => void): MenuItem => {
    return {
      template: (
        <div onClick={handleHomeClick} className='c-home-item'>
          <i className='pi pi-home'></i>
        </div>
      ),
      className: 'home-item',
    };
  };

  static languageModel = (
    handleLanguageChange: (lang: string) => void,
    t: (key: string) => string
  ): MenuItem => {
    return {
      label: t('language'),
      className: 'c-logout-item',
      items: [
        { label: 'English', command: () => handleLanguageChange('en') },
        { label: 'Español', command: () => handleLanguageChange('es') },
      ],
    };
  };
}
