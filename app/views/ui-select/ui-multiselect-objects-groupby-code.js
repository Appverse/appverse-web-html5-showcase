$scope.disabled = undefined;

$scope.enable = function() {
    $scope.disabled = false;
};

$scope.disable = function() {
    $scope.disabled = true;
};

$scope.personAsync = {
    selected: "wladimir@email.com"
};
$scope.peopleAsync = [];

$timeout(function() {
    $scope.peopleAsync = [{
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States'
    }, {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina'
    }, {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina'
    }, {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador'
    }, {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador'
    }, {
        name: 'Samantha',
        email: 'samantha@email.com',
        age: 30,
        country: 'United States'
    }, {
        name: 'Nicole',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }, {
        name: 'Natasha',
        email: 'natasha@email.com',
        age: 54,
        country: 'Ecuador'
    }, {
        name: 'Michael',
        email: 'michael@email.com',
        age: 15,
        country: 'Colombia'
    }, {
        name: 'Nicolás',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }];
}, 3000);

$scope.counter = 0;
$scope.someFunction = function(item, model) {
    $scope.counter++;
    $scope.eventResult = {
        item: item,
        model: model
    };
};

$scope.person = {};
$scope.people = [{
    name: 'Adam',
    email: 'adam@email.com',
    age: 12,
    country: 'United States'
}, {
    name: 'Amalie',
    email: 'amalie@email.com',
    age: 12,
    country: 'Argentina'
}, {
    name: 'Estefanía',
    email: 'estefania@email.com',
    age: 21,
    country: 'Argentina'
}, {
    name: 'Adrian',
    email: 'adrian@email.com',
    age: 21,
    country: 'Ecuador'
}, {
    name: 'Wladimir',
    email: 'wladimir@email.com',
    age: 30,
    country: 'Ecuador'
}, {
    name: 'Samantha',
    email: 'samantha@email.com',
    age: 30,
    country: 'United States'
}, {
    name: 'Nicole',
    email: 'nicole@email.com',
    age: 43,
    country: 'Colombia'
}, {
    name: 'Natasha',
    email: 'natasha@email.com',
    age: 54,
    country: 'Ecuador'
}, {
    name: 'Michael',
    email: 'michael@email.com',
    age: 15,
    country: 'Colombia'
}, {
    name: 'Nicolás',
    email: 'nicolas@email.com',
    age: 43,
    country: 'Colombia'
}];


$scope.multipleDemo = {};
$scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];

//Out of controller
.filter('propsFilter', function() {

    'use strict';
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
