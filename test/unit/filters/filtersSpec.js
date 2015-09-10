'use strict';

angular.module('App.Filters');

describe('Unit: Testing Filters', function () {
    var dateFormatFilter;

    beforeEach(angular.mock.module('App.Filters'));

    beforeEach(inject(function(_dateFormatFilter_) {
        dateFormatFilter = _dateFormatFilter_;
    }));

    it('should format the date', function() {
        var theTestDay = new Date(2015, 8, 8); // 2015-08-08
        expect(dateFormatFilter(theTestDay)).toEqual('9/8/2015 0:01 AM');
    });

});
