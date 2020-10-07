
const axios = require('axios');

export const AddAxiosInterceptors = () => {
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // if (error.status === 401 && )
        // console.log(error.response)
        return Promise.reject(error);
    });
}

export const LoadEnvironment = () => {
    // const env = process.env.NEXT_PUBLIC_APP_ENV;
    // if (env === "prod") {
    //     console.log = function () {};
    // }
}