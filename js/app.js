(function() {
    'use strict';

    var MainController = function MainController($scope, $http) {
        var self = this;

        var width = 420,
            barHeight = 20;

        var linearConverter = d3.scaleLinear(),
            xBar = linearConverter
            .range([0, width]);

        var chart = d3.select(".chart")
            .attr("width", width);

        self.update = function update(data) {
            if(data) {

                xBar.domain([0, d3.max(data.query.search, function(d) {
                    return d.wordcount;
                })]);
                var bars = chart.selectAll("g")
                    .data(data.query.search);
                bars.enter().append("g")
                    .attr("transform", function(d, i) {
                        return "translate(0," + i * barHeight + ")";
                    });
                bars.selectAll("rect").remove();
                bars.append("rect")
                    .transition()
                    .duration(500)
                    .attr("width", function(d) {
                        return xBar(d.wordcount);
                    })
                    .attr("height", barHeight - 1)



                bars.selectAll("text")
                    .remove();

                //this is where we add nums
                bars.append("text")
                    .transition()
                    .duration(500)
                    .attr("x", function(d) {
                        return xBar(d.wordcount);
                    })
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .text(function(d) {
                        return d.wordcount;
                    });
            }
        };

        $scope.$watch('main.search', function(val, ind) {
            console.log('Value is : ' + val);
            $http
                .jsonp('https://en.wikipedia.org/w/api.php/?action=query&list=search&format=json&srsearch=' + val + '&callback=JSON_CALLBACK')
                .success(function(data) {
                    console.log("data", data);


                    if (!val) {
                        xBar.domain([0, d3.max(data.query.search, function(d) {
                            return d.wordcount;
                        })]);

                        chart.attr("height", barHeight * data.query.search.length);

                        var bar = chart.selectAll("g")
                            .data(data.query.search)
                            .enter().append("g")
                            .attr("transform", function(d, i) {
                                return "translate(0," + i * barHeight + ")";
                            });

                        bar.append("rect")
                            .attr("width", function(d) {
                                return xBar(d.wordcount);
                            })
                            .attr("height", barHeight - 1);

                        bar.append("text")
                            .attr("x", function(d) {
                                return xBar(d.wordcount) - 3;
                            })
                            .attr("y", barHeight / 2)
                            .attr("dy", ".35em")
                            .text(function(d) {
                                return d.wordcount;
                            });
                    } else {
                        self.update(data);
                    }
                });

        });


    };

    function jsonp_callback(data) {
        // returning from async callbacks is (generally) meaningless
        console.log(data);
    }

    MainController.$inject = ['$scope', '$http'];

    angular.module('d3Angular', [])
        .controller('MainController', MainController);

})();
