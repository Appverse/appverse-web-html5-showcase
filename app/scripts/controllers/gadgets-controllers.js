'use strict';
/*
 * Set of controllers for the UI section.
 * They act as logic for each UI element.
 */
angular.module('appverseClientIncubatorApp')
    .controller('AlertDemoCtrl',
        function ($scope) {
            $scope.alerts = [
                {
                    type: 'error',
                    msg: 'Oh snap! Change a few things up and try submitting again.'
                },
                {
                    type: 'success',
                    msg: 'Well done! You successfully read this important alert message.'
                }
            ];

            $scope.addAlert = function () {
                $scope.alerts.push({
                    msg: "Another alert!"
                });
            };

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

        })

.controller('CollapseDemoCtrl',
    function ($scope) {
        //UI Demo Page
        $scope.uidemoCollapsed = true;
        //Landing Page
        $scope.routingCollapsed = true;
        $scope.stylingCollapsed = true;
        $scope.securityCollapsed = true;
        $scope.integrationCollapsed = true;
        $scope.configurationCollapsed = true;
        $scope.performanceCollapsed = true;
        $scope.servercommunicationCollapsed = true;
        $scope.testingCollapsed = true;
        $scope.lifecycleCollapsed = true;
    })

.controller('DatepickerDemoCtrl',
    function ($scope, $timeout) {
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = ($scope.minDate) ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function () {
            $timeout(function () {
                $scope.opened = true;
            });
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };
    })



.controller('ModalDemoCtrl', ['$scope', '$modal', '$log',
    function ($scope, $modal, $log) {

        $scope.items = ['patata1', 'patata2'];

        $scope.open = function () {
            var ModalInstanceCtrl = /* @ngInject */ function ($scope, $modalInstance, items) {

                //        $scope.input = {};
                //        $scope.ok = function () {
                //            alert($scope.input.abc);
                //        };

                $scope.items = items;
                $scope.selected = {
                    item: $scope.items[0]
                };

                $scope.ok = function () {
                    //$log.info("en OK titleData: " + $scope.input.title)
                    $modalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    //        input: function (){
                    //            return $scope.input;
                    //        },
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);
