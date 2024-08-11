import { formatDateToYYYYMMDD } from "../../contracts/utilsAndConsts";

export const childrenOptions = [
    { born_date: '2014-10-01', names: 'Emily Johnson', status: 'Activo' }, // 9 years old
    { born_date: '2017-01-15', names: 'Aiden Smith', status: 'Activo' },  // 7 years old
    { born_date: '2016-05-22', names: 'Sophia Davis', status: 'Activo' }, // 8 years old
    { born_date: '2016-11-30', names: 'Jackson Lee', status: 'Activo' },  // 8 years old
    { born_date: '2018-03-18', names: 'Olivia Martinez', status: 'Activo' }, // 6 years old
    { born_date: '2018-07-10', names: 'Liam Brown', status: 'Activo' },   // 5 years old
    { born_date: '2019-02-20', names: 'Isabella Wilson', status: 'Activo' }, // 5 years old
    { born_date: '2018-09-05', names: 'Noah Taylor', status: 'Activo' },   // 5 years old
    { born_date: '2019-06-12', names: 'Mia Anderson', status: 'Activo' },  // 4 years old
    { born_date: '2020-04-25', names: 'Lucas Thompson', status: 'Activo' }, // 3 years old
    { born_date: '2020-08-17', names: 'Charlotte White', status: 'Activo' }, // 3 years old
    { born_date: '2021-01-11', names: 'Ethan Harris', status: 'Activo' },  // 2 years old
    { born_date: '2021-07-29', names: 'Amelia Clark', status: 'Activo' },  // 2 years old
    { born_date: '2022-05-14', names: 'James Lewis', status: 'Activo' },   // 1 year old
    { born_date: '2022-09-22', names: 'Ava Robinson', status: 'Activo' },  // 1 year old
    { born_date: '2023-03-30', names: 'Benjamin Walker', status: 'Activo' }, // 6 months old
    { born_date: '2023-05-20', names: 'Harper Hall', status: 'Activo' },    // 6 months old
    { born_date: '2023-07-15', names: 'Henry Allen', status: 'Activo' },    // 4 months old
    { born_date: '2023-08-25', names: 'Ella Young', status: 'Activo' },     // 3 months old
    { born_date: '2023-09-10', names: 'Jack King', status: 'Activo' }       // 2 months old
  ];
  

  export   const defaultChild = {
    names: '',
    disabled:false,
    cash: '',
    check: '',
    date: formatDateToYYYYMMDD(new Date())
  };
  export const formatDate = (date) => {
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
  
    return `${month}/${day}/${year}`;
  };
  