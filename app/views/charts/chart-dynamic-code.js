$scope.name = 'Charts';

$scope.dynLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
$scope.dynData = [300, 500, 100, 40, 120];
$scope.dynType = 'PolarArea';

$scope.dynToggle = function () {
    $scope.dynType = $scope.dynType === 'PolarArea' ? 'Pie' : 'PolarArea';
};

$interval(function () {
    $scope.dynToggle();
}, 10000);

$scope.onClick = function(points, evt) {
    console.log(points, evt);
};
