/* eslint-disable no-unused-vars */
import { Button } from 'primereact/button'

import { Card } from 'primereact/card'
import { Messages } from 'primereact/messages'
import CalendarWrapper from '../../../formsComponents/CalendarWrapper'
import InputTextWrapper from '../../../formsComponents/InputTextWrapper'
import PasswordWrapper from '../../../formsComponents/PasswordWrapper'
import useRegisterViewModelForm from '../../modelView/useRegisterViewModelForm'

const FormRegister = () => {
  const { control, onSubmit, handleSubmit, toast, t, navigate } =
    useRegisterViewModelForm()

  return (
    <Card className='c-register-card'>
      <Messages ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} className='c-form-register'>
        <h3 id="title"> {t('registerForm')}</h3>
        <InputTextWrapper
          name={`userName`}
          control={control}
          rules={{ required: t('username_is_required') }}
          label={t('userName')}
        />

        <InputTextWrapper
          name={`first_name`}
          control={control}
          rules={{ required: t('first_name_is_required') }}
          label={t('first_name')}
        />

        <InputTextWrapper
          name={`last_name`}
          control={control}
          rules={{ required: t('last_name_is_Required') }}
          label={t('last_name')}
        />
        <InputTextWrapper
          name={`email`}
          control={control}
          keyFilter='email'
          rules={{
            required: t('emailRequired'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('emailInvalid')
            }
          }}
          label={t('email')}
          spanClassName='c-small-field r-m-13'
        />
        <CalendarWrapper
          name={`birth_date`}
          control={control}
          maxDate={new Date()}
          rules={{ required: t('birth_date_is_required') }}
          label={t('birth_date')}
        />
        <PasswordWrapper
          name={`password`}
          control={control}
          rules={{ required: t('password_is_required') }}
          label={t('password')}
        />
        <div className='c-section-register-actions'>
          <Button label='Submit' type='submit' className='p-button-success' />
          <Button
            label={t('return')}
            onClick={() => navigate('/childadmin/admin/login')}
            severity='secondary'
          />
        </div>
      </form>
    </Card>
    // <div className="work-in-progress-container">
    //   <ProgressSpinner className="pi-spin" />
    //   <div className="progress-message">
    //     We are currently working on this component. Please check back soon!
    //   </div>
    // </div>
  )
}

export default FormRegister
