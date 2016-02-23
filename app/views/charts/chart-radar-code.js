$scope.name = 'Charts';

$scope.radarLabels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
$scope.radarData = [
    [65, 59, 90, 81, 56, 55, 40],
    [28, 48, 40, 19, 96, 27, 100]
];

Click = function(points, evt) {
    console.log(points, evt);
};
