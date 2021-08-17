const axios = require('axios')
require('dotenv').config()

const instance = axios.create({
    baseURL: 'https://yael-story.myshopify.com/admin/api/2021-07',
    headers: {
        'content-type': 'application/json',
        'Authorization': process.env.SHOPIFY_AUTH,
     }
  });

  module.exports = {instance};