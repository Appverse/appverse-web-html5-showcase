$scope.name = 'Charts';

$scope.polarLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
$scope.polarData = [300, 500, 100, 40, 120];

$scope.onClick = function(points, evt) {
    console.log(points, evt);
};
