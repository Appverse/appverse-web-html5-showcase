$scope.name = 'Charts';

$scope.doughnutData = [300, 500, 100];
$scope.doughnutLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

$scope.onClick = function(points, evt) {
    console.log(points, evt);
};
