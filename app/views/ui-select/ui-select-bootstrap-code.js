$scope.disabled = undefined;

$scope.enable = function () {
    $scope.disabled = false;
};

$scope.disable = function () {
    $scope.disabled = true;
};

$scope.clear = function () {
    $scope.person.selected = undefined;
    $scope.address.selected = undefined;
    $scope.country.selected = undefined;
};


$scope.address = {};
$scope.refreshAddresses = function (address) {
    var params = {
        address: address,
        sensor: false
    };
    return $http.get(
        'https://maps.googleapis.com/maps/api/geocode/json', {
            params: params
        }
    ).then(function (response) {
        $scope.addresses = response.data.results;
    });
};
