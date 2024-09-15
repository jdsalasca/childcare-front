/* eslint-disable no-unused-vars */
import { Button } from 'primereact/button'

import { Card } from 'primereact/card'
import { Messages } from 'primereact/messages'
import CalendarWrapper from '../../../formsComponents/CalendarWrapper'
import InputTextWrapper from '../../../formsComponents/next-ui/InputTextWrapper'
import PasswordWrapper from '../../../formsComponents/PasswordWrapper'
import useRegisterViewModelForm from '../../modelView/useRegisterViewModelForm'

const FormRegister = () => {
  const { control, onSubmit, handleSubmit, toast, t, navigate } =
    useRegisterViewModelForm()

  return (
    <Card className='container shadow-lg rounded-lg m-auto p-4 max-w-screen-m !bg-red-400'>
      <Messages ref={toast} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='container flex  p-8 flex-col gap-3 justify-center max-w-screen-sm mx-auto'
      >
        <h3 className='mb-5'> {t('registerForm')}</h3>
        <InputTextWrapper
          name={`userName`}
          control={control}
          rules={{ required: t('username_is_required') }}
          label={t('userName')}
          className=' !w-full'
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
        <div className='flex flex-col min-w-full'>
          <Button
            label='Submit'
            type='submit'
            className='ml-auto text-white max-h-3'
          />
          <Button
            label={t('return')}
            onClick={() => navigate('/childadmin/admin/login')}
            severity='secondary'
            className='ml-auto text-white max-h-3'
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
