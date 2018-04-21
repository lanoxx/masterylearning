angular.module ('myapp.teacher.histogram', ["myapp.d3service"])

.directive ('myAppHistogram', ["d3", function (d3)
{
    function HistogramController ($scope) {

        $scope.statistics.$promise.then (function() {
            init($scope.statistics)
        });

        function init (statistics)
        {
            var entries = statistics.historyEntriesPerUsers;

            var result = entries.filter (byPositiveHistoryCount)
                                .map (toPercentageAndCount, statistics);

            result = groupBy (result, getPercentage, reduceToCount);

            result = Array.from (result)
                          .map (arrayToPercentageAndCount);

            $scope.targetData = result;

            $scope.$broadcast('myAppHistogram.ready');
        }

        function byPositiveHistoryCount (item) {
            return item.historyCount > 0;
        }

        // function expects 'this' to be bound to the statistics object
        function toPercentageAndCount (item) {
            var percentage = item.historyCount / this.entryCount * 100;

            // This effectively sets the percentage value to the next lower multiple of 5.
            // Example: For the value 27.8 the results is 25.
            percentage = Math.floor (percentage / 5) * 5;

            return {percentage: percentage, count: 1};
        }

        function getPercentage (item) {
            return item.percentage;
        }

        function reduceToCount (prevItem, item)
        {
            if (prevItem)
                return prevItem + item.count;
            else
                return item.count;
        }

        function arrayToPercentageAndCount (item)
        {
            return {percentage: item[0], count: item[1]};
        }

        function groupBy (list, keyGetter, reductor)
        {
            var map = new Map ();
            list.forEach (function (item)
                          {
                              var key = keyGetter (item);
                              if (!map.has (key)) {
                                  map.set (key, reductor (null, item));
                              } else {
                                  map.set (key, reductor (map.get (key), item));
                              }
                          });
            return map;
        }
    }

    function onPostLink (scope, element)
    {
        scope.$on ('myAppHistogram.ready', function () {
            drawHistogram(scope, element);
        });

        function drawHistogram (scope, element)
        {
            var container = element[0];
            var numberOfBars = 21;

            var margin = {top: 20, right: 40, bottom: 30, left: 20},
                width = 960 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom,
                barWidth = Math.floor (width / numberOfBars) - 1;

            var x = d3.scale.linear ()
                      .range ([barWidth / 2, width - barWidth / 2]);

            var y = d3.scale.linear ()
                      .range ([height, 0]);

            // Set x and y domains to their respective ranges.
            x.domain ([0, 100]);
            y.domain ([0, d3.max (scope.targetData, function (d)
            {
                return d.count;
            })]);

            var yAxis = d3.svg.axis ()
                          .scale (y)
                          .orient ("right")
                          .tickSize (-width)
                          .tickFormat (function (d)
                                       {
                                           return Math.round (d) + "";
                                       });

            while (container.firstChild) {
                element.remove (container.firstChild);
            }

            // An SVG element which will contain the histogram
            var svg = d3.select(container).append ("svg")
                        .attr ("width", width + margin.left + margin.right)
                        .attr ("height", height + margin.top + margin.bottom)
                        .append ("g")
                        .attr ("transform", "translate(" + margin.left + "," + margin.top + ")");

            // A container to hold the vertical bars for each percentage group.
            var percentageBars = svg.append ("g")
                                    .attr ("class", "percentageBars");

            // Add an y axis to show the count values.
            var yAxisContainer = svg.append ("g");


            // Add ticks to y axis with 'count' values.
            yAxisContainer.attr ("class", "y axis")
                          .attr ("transform", "translate(" + width + ",0)")
                          .call (yAxis)
                          .selectAll ("g")
                          .filter (function (value) {
                              return !value;
                          })
                          .classed ("zero", true);

            // Add label to y axis with 'Count' label.
            yAxisContainer.selectAll (".axisLabel")
                          .data (["Count"])
                          .enter ().append ("text")
                          .attr ("class", "axisLabel")
                          .attr ("text-anchor", "middle")
                          .attr ("transform", "rotate(90)")
                          .attr ("x", height / 2)
                          .attr ("dy", "-1.2em")
                          .text (function () {
                              return "Count"
                          });

            // Add container element for labeled percentageBars for each percentage group.
            var percentageBar = percentageBars.selectAll (".percentage")
                                              .data (d3.range (0, 105, 5))
                                              .enter ().append ("g")
                                              .attr ("class", "percentageBar")
                                              .attr ("transform", function (percentage)
                                              {
                                                  return "translate(" + x (percentage) + ",0)";
                                              });

            // Add percentageBar rectangle
            percentageBar.selectAll ("rect")
                         .data (function (percentage)
                                {
                                    var item = scope.targetData.find (function (item)
                                                                      {
                                                                          return item.percentage === this.percentage;
                                                                      }, {percentage: percentage});

                                    return item ? [item.count] : [0];
                                })
                         .enter ().append ("rect")
                         .attr ("x", -barWidth / 2)
                         .attr ("width", barWidth)
                         .attr ("y", y)
                         .attr ("height", function (value) {
                             return height - y (value);
                         });

            // Add labels to percentageBar that shows count current bar.
            percentageBar.append ("text")
                         .attr ("y", height - 4)
                         .attr("text-anchor", "middle")
                         .text (function (percentage) {
                             var item = scope.targetData.find (function (item) {
                                 return item.percentage === percentage;
                             });
                             return item ? item.count : 0;
                         });

            // Add labels on x-axis to show percentage values
            svg.append ("g").attr ("class", "x axis")
               .selectAll (".percentage")
               .data (d3.range (0, 101, 5))
               .enter ().append ("text")
               .attr ("class", "percentage")
               .attr ("x", function (percentage) {
                   return x (percentage);
               })
               .attr ("y", height + 4)
               .attr ("dy", ".71em")
               .text (function (percentage) {
                   return percentage;
               });

            var xAxisLabel = svg.append ("g").attr("class", "x axis")
                                .attr ("transform", function ()
                                {
                                    return "translate(" + width / 2 + ", 0)";
                                });

            xAxisLabel.selectAll(".axisLabel")
                      .data(["Percentage"])
                      .enter ().append("text")
                      .attr ("class", "axisLabel")
                      .attr ("text-anchor", "middle")
                      .attr ("dy", "1.2em")
                      .attr ("y", height + 10)
                      .text (function () { return "Percentage" });
        }
    }

    return {
        restrict: 'E',

        scope: {
            controller: '=',
            statistics: '='
        },

        controller: ['$scope', HistogramController],

        link: onPostLink
    }
}]);
