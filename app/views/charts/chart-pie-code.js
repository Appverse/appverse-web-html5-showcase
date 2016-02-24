$scope.name = 'Charts';

$scope.pieLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
$scope.pieData = [300, 500, 100];

$scope.onClick = function(points, evt) {
    console.log(points, evt);
};
