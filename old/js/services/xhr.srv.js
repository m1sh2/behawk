'use strict';

/*

xhr service

*/

app.service('xhr', ['$http', '$location', function($http, $location) {
    var xhr = this;
    // function RESULT(data) {

    // }

    function dataPrepare(data) {
        if (Object.keys(data).length > 0) {
            data = Base64.encode(JSON.stringify(data));
        } else {
            data = '';
        }
        return data;
    }

    function resultPrepare(res, result) {
        console.info(res);
        if (res.data.hasOwnProperty('error') && res.data.error == 'login') {
            $location.path('/login');
        }
        if (typeof result !== 'undefined') {
            result(res);
        }
    }

    xhr.get = function(url, data, result) {
        // console.info(result);
        $http.get(url + '&data=' + dataPrepare(data)).then(function(res) {
            resultPrepare(res, result);
        });
    }

    xhr.post = function(url, data, result) {
        $http.post(url + '&data=' + dataPrepare(data)).then(function(res) {
            resultPrepare(res, result);
        });
    }

    // return xhr;
}]);