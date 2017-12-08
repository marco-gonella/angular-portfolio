
(function(global, factory) {

      if(typeof define === 'function' && define.amd){
        define( ["angular",
        "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"], factory);
      }else{
        if (typeof global.angular === 'undefined') {
            throw new Error('Come on man! Angular Portfolio\'s JavaScript requires Angular');
        } else if (typeof global.lodash === 'undefined') {
            throw new Error('Come on man! Angular Portfolio\'s JavaScript requires Lodash');
        } else
            global.angularPortfolioModule = factory(global.angular, global.lodash);
      }
})(window, function(angular, _) {
    'use strict';

    return angular.module("angularPortfolio",[])
        .directive('parseStyle', parseListDirective)
        .filter('toTrusted', function ($sce) {
            return function (value) {
                return $sce.trustAsHtml(value);
            }
        })
        .directive("ngPortfolio", angularPortfolioDirective)

    angularPortfolioDirective.$inject = [];

    function parseListDirective($interpolate) {
        return function (scope, elem) {
            var exp = $interpolate(elem.html()),
                watchFunc = function () { return exp(scope); };

            scope.$watch(watchFunc, function (html) {
                elem.html(html);
            });
        };
    }

    function angularPortfolioDirective() {

        function link($scope, element, attrs) {

            if(!$scope.items && !Array.isArray($scope.items)){
                console.error("Invalid Items, check it");
            }

            $scope.genericConfig = $scope.genericConfig || {};
            if (!$scope.genericConfig.rec){
                $scope.genericConfig.rec = { iteration: 0 };
                //God forgive me
                $scope.mainScope = $scope.$parent;
            }

            var gC = $scope.genericConfig;

            if (gC.rec.iteration > 0)
                setIds(true, gC.rec.parentId);
            else
                setIds();

            parseItems();

            var areas = parseArea($scope.areas || createDefaultAreas(gC.nCols), gC.rec.parentId);

            $scope.gridStyle = parseGrid(gC.nCols, gC.sizeRow, gC.gap);

            //FUNCTIONS
            function setIds(isRecoursive, parentId) {
                _.forEach($scope.items, function (item, index) {
                    if (isRecoursive) {
                        if (!item.id) item.id = parentId + "-sub" +(index + 1);
                        else item.id = parentId + "-" + item.id;
                    } else {
                        if (!item.id) item.id = "item" + (index + 1);
                    }
                })
            }

            function parseItems(){
                if($scope.items){
                    _.map($scope.items, function(item){
                        if(item.value)
                            item.value = item.value.replace(/(%[i]%)/g, "<i class=\'" + (item.icon || '') + "\'></i>");
                        if(item.callback){
                            if(typeof item.callback === 'function'){
                                item.doClick = item.callback;
                            }else{
                                if($scope.mainScope[item.callback.name]){
                                    item.doClick = $scope.mainScope[item.callback.name].bind.apply($scope.mainScope[item.callback.name], [null].concat(item.callback.params))
                                }else{
                                     item.doClick = function(){};
                                     console.error('callback: ( '+ item.callback.name + ' ) is not associated to scope, ' +
                                     'for more info check documentation online');
                                }
                            }

                        }
                        return item;
                    });
                }
            }

            function parseArea(areas, parentId){
                if(parentId){
                    areas.forEach(function(row){
                        row.forEach(function(tupla, index){
                            row[index] = tupla == "." ? tupla : parentId + '-' + tupla;
                        })
                    });
                }
                return areas;
            }

            function createDefaultAreas(nCols){
                nCols = nCols || 3;
                var areas = [];
                var row;
                setIds()
                _.forEach($scope.items, function(item, index){
                    row = [];
                    for(var i=0; i < nCols; i++){
                        row.push(item.id);
                    }
                    areas.push(row);
                })
                return areas;
            }

            function parseGrid(nCols, sizeRow, gap) {
                var areasMaxCols = _.maxBy(areas, function (area) { return area.length; }).length;
                validatePortfolio(areas, areasMaxCols)
                var style = {
                    'grid-template-areas': '',
                    'grid-template-columns': 'repeat(' + (nCols || areasMaxCols) + ', 1fr )',
                    'grid-template-rows': ((gC.rec.iteration > 0) ? "" : 'repeat(' + (areas.length) + ', ' + (sizeRow || '200px') + ')'),
                    'grid-gap': gap
                };
                areas.forEach(function (area) {
                    style['grid-template-areas'] += "\'" + area.join(' ') + "\'";
                });
                return style;
            }

            function validatePortfolio(areas, areasMaxCols) {
                _.map(areas, function (row) {
                    while (row.length < areasMaxCols) {
                        row.push(".");
                    }
                });
            }
        }

        return {
            restrict: 'EA',
            scope: {
                //
                genericConfig: '=?',
                //html elements + css configs
                items: '=?',
                //initial grid position
                areas: '=?',
                //to manage callbacks
                mainScope: '<'
            },
            link: link,
            template:
            '<style parse-style>.portfolio-container {'+
                'display: grid;'+
                'grid-gap: 20px;'+
                'height: 100%;'+
            '}'+
            '.items {'+
                'color: white;'+
                'display: flex;'+
                'justify-content: center;'+
                'align-items: center;'+
                'font-size: 2em;'+
            '}'+
            '.items span {'+
                'z-index: 100;'+
            '}'+
            '.inner-portfolio-container {'+
                'display: grid;'+
                'min-width: 100%;'+
                'min-height: 100%;'+
                'position: absolute;'+
                'top: 0;'+
                'right: 0;'+
            '}'+
            '@media screen and (max-width: 1200px) {'+
                '.portfolio-container {'+
                  ' grid-gap: 10px;'+
                '}'+
            '}'+
            '@media screen and (max-width: 768px) {'+
                '.portfolio-container {'+
                   'grid-gap: 0px;'+
                '}'+
            '}'+
            '</style>'+
            '<div class="portfolio-container" ng-style="gridStyle">'+
                '<div ng-repeat="item in items" id="{{item.id}}" class="items {{item.class}}" style="{{item.callback ? \'cursor:pointer\' : \'\' }}" ng-click="item.doClick()">'+
                    '<style parse-style>'+
                        '.items#{{item.id}}{'+
                            'grid-area:{{item.id}};'+
                            'position: relative;'+
                            'overflow: hidden;'+
                            'padding: 0;'+
                            'background-color: {{item.backgroundColor || genericConfig.backgroundColor}};'+
                            'font-family: {{item.font || genericConfig.font}};'+
                            'font-size: {{item.fontSize || genericConfig.fontSize}};'+
                            'color:{{item.textColor || genericConfig.textColor}};'+
                            'transition: all {{item.animationTime || genericConfig.animationTime || \'none\'}};'+
                        '}'+
                        '.items#{{item.id}}:hover{'+
                            'background-color:{{item.hoverBackgroundColor || genericConfig.hoverBackgroundColor}};'+
                            'color:{{item.hoverTextColor || genericConfig.hoverTextColor}};'+
                        '}'+
                    '</style>'+
                    '<style parse-style ng-if="item.image">'+
                        '.items#{{item.id}}:after{'+
                            'content: \'\';'+
                            'display: block;'+
                            'position: absolute;'+
                            'top: 0;'+
                            'left: 0;'+
                            'height: 100%;'+
                            'width: 100%;'+
                            'background-repeat: no-repeat;'+
                            'background-position: center center;'+
                            'background-size: cover;'+
                            'transition: all {{item.animationTime || genericConfig.animationTime || \'0.5s\'}};'+
                            'background-image: url({{item.image}});'+
                            'opacity: {{item.shadeFocus ? 0.3: 1}};'+
                            'transform-origin: {{item.focusCenter}};'+
                        '}'+
                        ' .items#{{item.id}}:hover:after{'+
                            'transform: scale({{item.focusScale}});'+
                            'opacity: {{item.shadeFocus ?  0.7: 1}};'+
                        '}'+
                    '</style>'+
                    '<span ng-bind-html="item.value | toTrusted"></span>'+
                    '<ng-portfolio ng-if="item.subitems" class="inner-portfolio-container" ng-init="item.genericConfig.rec.iteration = genericConfig.rec.iteration + 1;item.genericConfig.rec.parentId = item.id" items="item.subitems" generic-config="item.genericConfig" areas="item.areas" main-scope="mainScope"></ng-portfolio>' +
                '</div>'+
            '</div>'
        };
    }
})
