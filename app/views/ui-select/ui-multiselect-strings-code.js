$scope.disabled = undefined;

$scope.enable = function () {
    $scope.disabled = false;
};

$scope.disable = function () {
    $scope.disabled = true;
};

$scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

$scope.multipleDemo = {};
$scope.multipleDemo.colors = ['Blue', 'Red'];
