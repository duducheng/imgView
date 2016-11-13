'use strict';

const APP = angular.module('imgView', ['ui.router', 'ngResource']);

APP.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController',
                    resolve: {
                        animals: ['homeFactory', function(homeFactory) {
                            return homeFactory.query();
                        }]
                    }
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }

        });

        $urlRouterProvider.otherwise('/');
    })

;
