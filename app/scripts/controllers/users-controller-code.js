 /*
                  Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
                  This Source Code Form is subject to the terms of the Appverse Public License
                  Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
                  file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf. [^]
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
 /*globals agGrid*/
 (function() {
     'use strict';

     agGrid.initialiseAgGridWithAngular1(angular);

     angular.module('App.Controllers')

     .controller('usersController',
         function($scope, Restangular, $log, $uibModal, RESTFactory) {
             $log.debug('usersController');

             RESTFactory.setAfterRoute('users', function() {
                 $scope.gridOptions.api.setRowData($scope.users);
             });

             $scope.gridOptions = {
                 enableColResize: true,
                 enableSorting: true,
                 enableFilter: true,
                 headerHeight: 40,
                 rowHeight: 60,
                 angularCompileRows: true,
                 suppressLoadingOverlay: true,
                 onGridSizeChanged: function() {
                     $scope.gridOptions.api.sizeColumnsToFit();
                 }
             };

             $scope.initGrid = function() {

                 var columns = [];

                 angular.forEach($scope.users[0].plain(), function(value, key) {

                     var tpl = '<p ng-bind="data.' + key + '"></p>';

                     if (key === 'id') {
                         columns.push({
                             field: key,
                             headerName: key,
                             minWidth: 65,
                             maxWidth: 65,
                             template: tpl
                         });
                     } else {
                         columns.push({
                             field: key,
                             headerName: key,
                             template: tpl
                         });
                     }
                 });

                 columns.push({
                     headerName: 'actions',
                     templateUrl: 'views/rest/ag-grid/actions-template-code.html',
                     minWidth: 170,
                     maxWidth: 170,
                     suppressMenu: true,
                     suppressSorting: true
                 });

                 $scope.gridOptions.api.setColumnDefs(columns);
                 $scope.gridOptions.api.sizeColumnsToFit();
             };

             $scope.confirm = function(item) {
                 return confirm('Are you sure you want to delete ' + item.name + ' ?');
             };

             $scope.open = function(item, duplicate) {

                 if (item) {
                     item = item.clone();
                     if (duplicate) {
                         item.fromServer = false;
                     }
                 } else {
                     item = {
                         getParentList: function() {
                             return $scope.users;
                         }
                     };
                 }

                 $scope.item = item;

                 $uibModal.open({
                     templateUrl: 'views/rest/ag-grid/usersModalForm-code.html',
                     controller: 'users-modal-controller',
                     scope: $scope
                 });
             };

             $scope.closeAlert = function(index) {
                 $scope.usersErrors.splice(index, 1);
             };
         })

     .controller('users-modal-controller',
         function($scope, $uibModalInstance) {

             $scope.ok = function() {
                 $uibModalInstance.close();
             };
             $scope.cancel = function() {
                 $uibModalInstance.close();
             };
         });
 })();