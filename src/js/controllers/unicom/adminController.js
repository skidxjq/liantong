'use strict';


app.controller('adminController', ['$scope', '$http','$modal', function ($scope, $http, $modal) {
    console.log($modal);
    console.log("into adminController");
    $scope.adminList = [];
    $scope.levels = ['管理员', '一般用户', '只读用户'];

    $scope.getAdminList =  function(){
        $http.get($scope.serverUrl + "/admin/list")
            .success(function(resp){
                $scope.adminList = resp;
            });
    };

    $scope.editAdmin = function(obj) {
        var id = obj._id;
        console.log(obj);
        var modalInstance = $modal.open({
            templateUrl: 'editAdminModal',
            controller: editAdminModalCtrl,
            resolve: {
                admin : function() {
                    return obj;
                },
                serverUrl: function(){
                    return $scope.serverUrl;
                }
            }
        });
    };

    $scope.addAdmin = function() {
        //var id = obj._id;
        //console.log(obj);

        var modalInstance = $modal.open({
            templateUrl: 'addAdminModal',
            controller: addAdminModalCtrl,
            resolve: {
                serverUrl : function() {
                    return $scope.serverUrl;
                }
                //serverUrl: function(){
                //    return $scope.serverUrl
                //}
            }
        });
    };

    $scope.delAdmin = function(id){
        //$
    };


    $scope.getAdminList();



}
]);



var editAdminModalCtrl = function($scope, $modalInstance, $window, admin,serverUrl,$http) {

    //$scope.form = {};
    //$scope.username="ttt";
    $scope.edit = {};
    $scope.edit._id = admin._id;
    $scope.edit.username = admin.username;
    $scope.edit.email = admin.email;
    console.log($scope.edit);
    $scope.editSubmit = function() {
        $http({
            method: 'POST',
            url: serverUrl + "/admin/edit",
            data: $scope.edit,
            headers: {
                'Content-Type': 'application/json'
            }}).then(function(result) {
            console.log(result);
            $modalInstance.close($window.location.reload());

        }, function(error) {
            console.log(error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
};


var addAdminModalCtrl = function($scope, $modalInstance, $window,$http,serverUrl) {

    //$scope.form = {};
    ////$scope.username="ttt";
    $scope.add = {};
    //$scope.add._id = admin._id;
    //$scope.add.username = admin.username;
    //$scope.add.email = admin.email;
    //console.log($scope.add);
    $scope.addSubmit = function() {
        $http({
            method: 'POST',
            url: serverUrl + "/admin/add",
            data: $scope.add,
            headers: {
                'Content-Type': 'application/json'
            }}).then(function(result) {
            console.log(result);
            $modalInstance.close($window.location.reload());

        }, function(error) {
            console.log(error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
};