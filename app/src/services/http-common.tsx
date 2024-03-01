import axios from 'axios';

//Define a URL base da origem para consumo do servico
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-type': 'application/json',
  },
});
