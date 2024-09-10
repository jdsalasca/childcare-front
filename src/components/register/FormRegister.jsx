import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useRef, useState } from 'react';
import { Message } from 'primereact/message';

import { Messages } from 'primereact/messages';     
import { emailRegex } from '../../utils/constants';
const FormRegister = () => {

  const [count, setCount] = useState(0);
  const [textValue, setTextValue] = useState("");
  const [textValue2, setTextValue2] = useState("");
  const [textValue3, setTextValue3] = useState("");
  const [textValue4, setTextValue4] = useState("");
  const [emailError, setEmailError] = useState(false);
  const msgs = useRef(null);

  const header = (
    <div><strong>Pick a Password</strong></div>
  )
  const onHandlerSubmit = (data) =>{
    if(!emailRegex.test(textValue4)){
      msgs.current.show({sticky: true, severity: 'info', closable:true, summary: 'Email Error', detail: 'Please put a valid Email'})
      setEmailError(true)
      return;
    }

     const userData = {
      userName: textValue,
      lastName:textValue2,
      password: textValue3
     }
    console.log("data", userData);
    
  }
  return (

      <>
      <Messages ref={msgs} />
<span id="wiwi" className="font-bold text-4xl mb-5">{count}</span>
<div className="flex flex-wrap gap-3">

      

    <Button icon="pi pi-plus" className="p-button-outlined p-button-rounded p-button-success"onClick={() => setCount(count +1)}></Button>
    <Button icon="pi pi-minus" className="p-button-outlined p-button-rounded" onClick={() => setCount(count -1)}></Button>
    <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger" onClick={() => setCount(0)}></Button>
    <form onSubmit={onHandlerSubmit}>
    <div className='c-component-form'>
    <label>Nombre</label>
    <InputText  value={textValue} onChange={(e) => setTextValue(e.target.value)} />
    </div>
    <div className='c-component-form'>
    <label>Apellido</label>
    <InputText  value={textValue2} onChange={(e) => setTextValue2(e.target.value)} keyfilter={/^[a-zA-Z\sñÑ]*$/}  />
    </div>
    <div className='c-component-form'>
    <label>Email</label>
    <InputText   className= "" 
    onFocus={() => setEmailError(false)} 
    onChange ={(e) => setTextValue4(e.target.value)}
    value={textValue4}  
    keyfilter={/^[a-zA-Z\sñÑ@.#&_-]*$/} 
    //keyfilter="email"
    />
    {emailError && <Message severity="info" text="Please put a valid Email" />}
    </div>
    <div className='c-component-form'>
    <label>Contraseña</label>
    <Password value={textValue3} onChange={(e) => setTextValue3(e.target.value)} toggleMask   header={header}/>
    </div>
    <Button label="Submit"  type='submit' onClick={data => {
      data.preventDefault()
      data.stopPropagation()
      onHandlerSubmit()
    }} />
    </form>
</div>
</>
      // <div className="work-in-progress-container">
      //   <ProgressSpinner className="pi-spin" />
      //   <div className="progress-message">
      //     We are currently working on this component. Please check back soon!
      //   </div>
      // </div>
    );
  }
  
export default FormRegister;
  