$scope.items = ['item1', 'item2', 'item3'];

$scope.animationsEnabled = true;

$scope.openModal = function(size) {

    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/ui-bootstrap/modal-template.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
            items: function() {
                return $scope.items;
            }
        }
    });

    modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
    }, function() {
        $log.info('Modal dismissed at: ' + new Date());
    });
};

$scope.toggleAnimation = function() {
    $scope.animationsEnabled = !$scope.animationsEnabled;
};

.controller('ModalInstanceCtrl',
    function($scope, $uibModalInstance, items) {

        'use strict';

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
