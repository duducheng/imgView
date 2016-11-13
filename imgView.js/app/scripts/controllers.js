'use strict';

APP.controller('HomeController', ["$scope", "$document", "$filter", "animals", "imagePath", "category", function($scope, $document, $filter, animals, imagePath, category) {
    const LEFT = 37,
        RIGHT = 39;

    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };

    var animalFilter = $filter('filter');

    $scope.labels = category;
    $scope.id = 0;
    $scope.tab = 0;

    $document.bind("keydown", function(e) {
        $scope.$apply(function() {
            if (e.keyCode === RIGHT) $scope.id++;
            else if (e.keyCode === LEFT) $scope.id--;
            $scope.id += $scope.num;
            setUp($scope.target, $scope.id);
        });
    });

    animals.$promise.then(function(res) {
        $scope.target = res;
        setUp($scope.target, $scope.id);
    });


    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab != 0) {
            animals.$promise.then(function(res) {
                $scope.target = animalFilter(res, {
                    classname: category[setTab - 1]
                }, true);
                setUp($scope.target, $scope.id);
            });
        } else {
            animals.$promise.then(function(res) {
                console.log(res);
                $scope.target = res;
                setUp($scope.target, $scope.id);
            });
        };
    };

    var setUp = function(target, id) {
        $scope.num = target.length;
        var focusOn = target[id % $scope.num];
        $scope.classname = focusOn['classname'];
        $scope.img = imagePath + focusOn['path'];
        $scope.values = $scope.labels.map(function(x) {
            return focusOn[x];
        });
        $scope.maxItem = $scope.labels[$scope.values.indexOf($scope.values.max())];
        draw();
    }

    //echarts
    // console.log(echarts);
    var draw = function() {
        var myChart = echarts.init(document.getElementById('echarts'));
        var option = {
            title: {
                text: 'Confidence'
            },
            tooltip: {},
            yAxis: {
                data: $scope.labels,
                axisTick: {
                    alignWithLabel: true
                },
                type: 'category',
            },
            xAxis: {
                max: 1,
                min: 0
            },
            series: [{
                type: 'bar',
                markPoint: {
                    data: [{
                        name: "Max",
                        type: 'max'
                    }],
                    symbol: "triangle",
                    symbolSize: 10,
                    symbolRotate: 90,
                    symbolOffset: ["50%", 0],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    }
                },
                data: $scope.values
            }]
        };
        myChart.setOption(option);
    }
}])

;
