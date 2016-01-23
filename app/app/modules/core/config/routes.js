'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        '$compileProvider',
        function($stateProvider, $urlRouterProvider, $compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|content):/);
            $urlRouterProvider.otherwise('/');

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the path is `'/'`, route to home
             * */
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeCtrl'
                });
            $stateProvider
                .state('orders', {
                    url: '/orders',
                    templateUrl: 'modules/core/views/orders.html',
                    controller: 'OrdersCtrl'
                });
            $stateProvider
                .state('buyers', {
                    url: '/buyers',
                    templateUrl: 'modules/core/views/buyers.html',
                    controller: 'BuyersCtrl'
                });
            $stateProvider
                .state('products', {
                    url: '/products',
                    templateUrl: 'modules/core/views/products.html',
                    controller: 'ProductsCtrl'
                });
            $stateProvider
                .state('categories', {
                    url: '/categories',
                    templateUrl: 'modules/core/views/categories.html',
                    controller: 'CategoriesCtrl'
                });
            $stateProvider
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'modules/core/views/settings.html',
                    controller: 'SettingsCtrl'
                });
        }
    ]);
