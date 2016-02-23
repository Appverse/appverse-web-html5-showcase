$scope.name = 'Charts';

$scope.reactLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
$scope.reactData = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
];
$scope.reactColours = [{ // grey
    fillColor: 'rgba(148,159,177,0.2)',
    strokeColor: 'rgba(148,159,177,1)',
    pointColor: 'rgba(148,159,177,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(148,159,177,0.8)'
}, { // dark grey
    fillColor: 'rgba(77,83,96,0.2)',
    strokeColor: 'rgba(77,83,96,1)',
    pointColor: 'rgba(77,83,96,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(77,83,96,1)'
}];
$scope.randomize = function() {
    $scope.reactData = $scope.reactData.map(function(data) {
        return data.map(function(y) {
            y = y + Math.random() * 10 - 5;
            return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
        });
    });
};

$interval(function() {
    $scope.randomize();
}, 5000);

$scope.onClick = function(points, evt) {
    console.log(points, evt);
};
