/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */
angular.module('App.Controllers')

.controller('UsersController',
    function ($scope, Restangular, $uibModal, $log) {

        'use strict';

        $log.debug('UsersController');

        $scope.gridOptions = {
            rowHeight: 65,
            headerRowHeight: 48,
            data: 'users',
            filterOptions: {},
            showFooter: true,
            enableRowSelection: false,
            columnDefs: [{
                field: 'name'
            }, {
                field: 'gender',
                width: 100
            }, {
                field: 'company'
            }, {
                field: 'age',
                width: 60
            }, {
                displayName: '',
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><button ng-click="openUser(row.entity)" class="btn btn-primary glyphicon glyphicon-pencil"></button>&nbsp;<button ng-click="openUser(row.entity,true)" class="btn btn-default glyphicon glyphicon-duplicate"></button>&nbsp;<button av-rest-remove="row.entity" rest-if="removeUser(row.entity)" class="btn btn-danger glyphicon glyphicon-trash"></button></span></div>',
                sortable: false,
                width: 168
             }]
        };

        $scope.closeAlert = function (index) {
            $scope.usersErrors.splice(index, 1);
        };

        $scope.openUser = function (user, duplicate) {

            if (user) {
                user = Restangular.copy(user);
                if (duplicate) {
                    user.fromServer = false;
                }
            } else {
                user = {
                    getParentList: function () {
                        return $scope.users;
                    }
                };
            }

            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/rest/user-modal-code.html',
                controller: 'UserModalController',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
        };

        $scope.removeUser = function (user) {
            return confirm('Are you sure you want to delete user ' + user.name + ' ?');
        };

    })

.controller('UserModalController', function ($scope, $uibModalInstance, user) {

    'use strict';

    $scope.user = user;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
