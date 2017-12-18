(function () {
    'use strict';


    angular.module('app').controller('TaskManagerCtrl', ['$rootScope', '$scope', '$uibModal', '$filter', '$location', '$timeout', '$window', 'request', 'validate', 'logger', 'langs', 'plugins', 'Page', TaskManagerCtrl]);

    function TaskManagerCtrl($rootScope, $scope, $uibModal, $filter, $location, $timeout, $window, request, validate, logger, langs, plugins, Page) {
        $scope.list = {};
        $scope.desks = {};
        $scope.tasks = {};
        $scope.card = {};
        $scope.class = "closed";
        $scope.cards = [];
        $scope.mass = [];
        $scope.users = {};
        $scope.title = {};
        $scope.title_edit = false;
        $scope.button_add_card = true;
        $scope.button_input_card = false;
        $scope.models = {};
        $scope.models.selected = null;
        $scope.show_settings = false;
        $scope.show_input_card = true;
        $scope.desk_title = true;
        $scope.counter = 0;
        $scope.all = 0;
        $scope.task = {};
        $scope.desk_name = '';
        $scope.create_desk_name = '';
        $scope.desk_id = '';
        $scope.task_name = '';

        $scope.initTaskManager = function() {
            $scope.getDesks();
        };

        /* Norm desks functionality */

        $scope.getDesks = function() {
            request.send('/TaskManager/getDesks', {}, function(data) {
                $scope.desks = data;
                $scope.desk = data[0];
                $scope.getDeskTasks($scope.desk);
            });
        };

        $scope.getDeskTasks = function(desk) {
            $scope.desk = desk;

            request.send('/TaskManager/getTasks', {'desk_id': desk.id}, function(data) {
                $scope.tasks = data;

                for (var k in data)
                {
                    $scope.all += data[k].cards.length;
                }
            });
        };

        $scope.saveDeskTitle = function(desk) {
            request.send('/TaskManager/saveDeskTitle', $scope.desk, function(data) {

            });

            $scope.desk_title = ! $scope.desk_title;
        };


        /* End of Norm desks functionality */

        $scope.saveDesk = function(desc_name) {
            request.send('/TaskManager/saveDesk', {'desc_name':desc_name}, function(data) {
                $scope.getDesks();
            });
        };

        $scope.getListTeamUsers = function(list_id) {
            request.send('/TaskManager/getListTeamUsers', {'list_id': list_id}, function(data) {
                $scope.list.this_lists_id = list_id;
                $scope.users = data.users;
                $scope.team_users = data.users_not_checked;
                $scope.users_list = $scope.team_users[0].users_id.toString();
            });
        };

        $scope.saveUserToList = function(user_id,list_id) {
            request.send('/TaskManager/saveUserToList', {'users_id': user_id, 'lists_id': list_id}, function(data) {
                $scope.getListTeamUsers(list_id);
            });
        };

        $scope.removeUserList = function(user_id,list_id) {
            request.send('/TaskManager/removeUserList', {'users_id': user_id, 'lists_id': list_id}, function(data) {
                $scope.getListTeamUsers(list_id);
            });
        };

        $scope.addTask = function() {
            request.send('/TaskManager/addTask', {'task_name': $scope.task_name, 'desk_id': $scope.desk.id}, function(data) {
                $scope.getDeskTasks($scope.desk);
            });
        };

        $scope.saveTaskTitle = function(task) {
            request.send('/TaskManager/saveTaskTitle', {'task_id': task.id,'task_name': task.name}, function(data) {

            });

            $scope.title[task.id] = ! $scope.title[task.id];
        };

        $scope.deleteDesk = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'sm',
                templateUrl: 'ConfirmWindow.html',
                controller: 'ModalConfirmWindowCtrl',
                resolve: {
                    items: function () {
                        return {
                            'deleted_item': 'desk',
                            'desk': $scope.desk
                        };
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getDeskTasks($scope.desk);
            }, function () {

            });
        }

        $scope.deleteTask = function(task) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'sm',
                templateUrl: 'ConfirmWindow.html',
                controller: 'ModalConfirmWindowCtrl',
                resolve: {
                    items: function () {
                        return {
                            'deleted_item': 'task',
                            'task': task
                        };
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getDeskTasks($scope.desk);
            }, function () {

            });
        };

        $scope.createCard = function(id) {
            $scope.card.task_id = id;
            request.send('/TaskManager/createCard', $scope.card, function(data) {
                $scope.getDeskTasks($scope.desk);
            });
        };

        $scope.selectCard = function(card) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'SelectCard.html',
                controller: 'ModalSelectCardCtrl',
                resolve: {
                    items: card
                }
            });

            modalInstance.result.then(function(response) {

            }, function () {
                $scope.getDeskTasks($scope.desk);
            });
        };

        $scope.savePosition = function(id,position) {
            request.send('/TaskManager/savePosition',{'id': id,'position': position}, function(data) {
            });
        };

        $scope.initSortable = function() {
            $scope.counter++;

            if ($scope.counter == $scope.all) {
                $( function() {
                    $('.outer').sortable({
                        items: ".sortable-outer",
                        update: function( event, ui ){
                            $scope.da = $(this).sortable('serialize');
                            $scope.savePosition($scope.da);
                        }
                    });

                    $('.inner').sortable({
                        items: ".sortable-inner"
                    });
                });
            }
        };

        $scope.$watch('$viewContentLoaded', function(){
            $scope.initScroll();
        });

        $scope.initScroll = function(){
            var curDown = false,
                curYPos = 0,
                curXPos = 0,
                curScroll = 0;

            $('.task_manager_board').mousemove(function(m){
                if(curDown === true){
                    $('.task_manager_board').scrollLeft(curScroll + (curXPos - m.pageX));
                }
            });

            $('.task_manager_board').mousedown(function(m){
                if (m.target.closest('.task_manager_list')){
                    curDown = false;
                }else {
                    curDown = true;
                    curYPos = m.pageY;
                    curXPos = m.pageX;
                    curScroll = $('.task_manager_board').scrollLeft();
                }
            });

            $('.task_manager_board').mouseup(function(){
                curDown = false;
            });
        }
    };
})();

(function () {
    'use strict';

    angular.module('app').directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].selectionStart = element[0].value.length;
                            element[0].selectionEnd = element[0].value.length;
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }]);

})();

(function () {
    'use strict';

    angular.module('app').directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})();

(function () {
    'use strict';

    angular.module('app').controller('ModalSelectCardCtrl', ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', '$filter', 'request', 'validate', 'logger', 'langs', 'items', ModalSelectCardCtrl]);

    function ModalSelectCardCtrl($rootScope, $scope, $uibModal, $uibModalInstance, $filter, request, validate, logger, langs, items) {
        $scope.card = items;
        $scope.checklists = items.checklists;
        $scope.temp_description = $scope.card.description;
        $scope.card_title = true;
        $scope.check = 1;
        $scope.show_description = true;
        $scope.showCheckBox = {};
        $scope.checkbox_active = true;
        $scope.old_checkbox_description = [];
        $scope.cards_users = [];
        $scope.comment_text = '';
        $scope.card_users_ids = [];
        $scope.team_users_ids = [];
        $scope.temp_users_id = [];
        $scope.checkbox = {};
        $scope.editChecklistItem = {};
        $scope.checklist_title = {};
        $scope.checkbox_title = {};
        $scope.add_checkbox_title = {};
        $scope.deadline= {};
        $scope.temp_users = {};
        $scope.showChecklistTitle = {};
        $scope.not_checked_users = [];
        $scope.checked_users = [];
        $scope.checked_ids = [];
        $scope.card_deadline = {};
        $scope.checkbox_deadline = {};
        $scope.temp_checkbox_deadline = {};
        $scope.showCheckboxDeadline = false;
        $scope.checklist_title = '';

        $scope.initCard = function() {
            $scope.getTeamUsers();
            $scope.getCheckboxUsers();
            //console.log($scope.card);
        };

        $scope.saveCardTitle = function() {
            request.send('/TaskManager/saveCardTitle', {'card_id': $scope.card.cards_id,'card_name': $scope.card.name}, function(data) {

            });

            $scope.card_title = ! $scope.card_title;
        };

        $scope.saveCardDescription = function() {
            $scope.card.description = $scope.temp_description;
            request.send('/TaskManager/saveCardDescription', $scope.card, function(data) {

            });

            $scope.show_description = ! $scope.show_description;
        };

        $scope.changeDone = function() {
            request.send('/TaskManager/changeDone', {'cards_id': $scope.card.cards_id}, function(data) {
                $scope.card.done = data;
            });
        };

        ////////////////////////////////////

        /* CHECKLISTS */

        $scope.saveChecklist = function() {
            request.send('/TaskManager/saveChecklist', {'title': $scope.checklist_title, 'cards_id': $scope.card.cards_id}, function(data) {
                $scope.card.checklists = data;
                $scope.checklist_title = '';
            });
        };

        $scope.saveChecklistTitle = function(checklist) {
            request.send('/TaskManager/saveChecklistTitle', {'checklist_id': checklist.id, 'checklist_title': checklist.title}, function(data) {

            });

            $scope.showChecklistTitle[checklist.id] = ! $scope.showChecklistTitle[checklist.id];
        };

        $scope.deleteChecklists = function(id) {
            request.send('/TaskManager/deleteChecklists', {'checklists_id': id,'cards_id': $scope.card.cards_id}, function(data) {
                $scope.getChecklists();
            });
        };

        /* END CHECKLISTS */

        ////////////////////////////////////

        /* CHECKBOXES */

        $scope.selectCheckbox = function(checkbox) {
            $scope.editChecklistItem = {};
            $scope.checked_users = {};
            $scope.checked_ids = [];
            $scope.showCheckBox = {};
            //$scope.showCheckboxDeadline = false;
            $scope.checkbox_title[checkbox.id] = angular.copy(checkbox.title);
            $scope.editChecklistItem[checkbox.id] = ! $scope.editChecklistItem[checkbox.id];
            if (checkbox.deadline != '') {
                $scope.temp_checkbox_deadline = checkbox.deadline;
            }
        };

        $scope.saveCheckboxDescription = function(checkbox) {
            $scope.chekbox_users_ids = [];
            for (var k in checkbox.users)
            {
                $scope.chekbox_users_ids[k] = checkbox.users[k].users_id;
            }

            $scope.checkbox.title = $scope.checkbox_title[checkbox.id];
            $scope.checkbox.id = checkbox.id;
            $scope.checkbox.users = $scope.chekbox_users_ids;
            $scope.checkbox.deadline = $scope.temp_checkbox_deadline;

            request.send('/TaskManager/saveCheckboxDescription', $scope.checkbox, function(data) {
                checkbox.deadline = data;
            });

            checkbox.title = $scope.checkbox_title[checkbox.id];
            $scope.editChecklistItem[checkbox.id] = ! $scope.editChecklistItem[checkbox.id];
        };

        $scope.resetCheckboxDescription = function(checkbox) {
            $scope.editChecklistItem[checkbox.id] = ! $scope.editChecklistItem[checkbox.id];
        };

        $scope.createNewCheckbox = function(checklist) {
            $scope.editChecklistItem = {};
            $scope.checked_users = {};
            $scope.checked_ids = [];
            $scope.temp_checkbox_deadline = {};
            $scope.showCheckboxDeadline = false;
            $scope.showCheckBox = {};
            $scope.showCheckBox[checklist.id] = ! $scope.showCheckBox[checklist.id];
            $scope.updateUserList();
        };

        $scope.addCheckbox = function(checklist) {
            $scope.checkbox.users = $scope.checked_ids;
            $scope.checkbox.deadline = $scope.temp_checkbox_deadline;
            $scope.checkbox.checklist_id = checklist.id;
            $scope.checkbox.checkbox_title = $scope.add_checkbox_title[checklist.id];
            $scope.temp_users = [];

            request.send('/TaskManager/addCheckbox', $scope.checkbox, function(data) {
                $scope.getCheckboxes(checklist);
            });

            $scope.showCheckBox[checklist.id] = ! $scope.showCheckBox[checklist.id];
            $scope.add_checkbox_title[checklist.id] = '';
            $scope.checked_ids = [];
            $scope.getCheckboxUsers();
        };

        $scope.deleteCheckbox = function(checkbox, checklist) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'sm',
                templateUrl: 'ConfirmWindow.html',
                controller: 'ModalConfirmWindowCtrl',
                resolve: {
                    items: function () {
                        return {
                            'deleted_item': 'checkbox',
                            'task_id': checkbox
                        };
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getCheckboxes(checklist);
            }, function () {

            });
        };

        $scope.getCheckboxes = function(checklist) {
            request.send('/TaskManager/getCheckboxes', {'checklist_id': checklist.id}, function(data) {
                checklist.checkboxes = data;
            });
        };

        $scope.uncheckedUsers = function(checkbox) {
            return function(value, index, array) {
                for (var k in checkbox.users) {
                    if (checkbox.users[k].users_id == value.users_id) {
                        return false;
                    }
                }

                return true;
            }
        };

        $scope.getCheckboxUsers = function() {
            $scope.checkbox_users = angular.copy($scope.card.users);

            if ($scope.checkbox_users) {
                $scope.add_checkbox_users_list = $scope.checkbox_users[0].users_id.toString();
            }

            $scope.updateUserList();
        };

        $scope.addCheckboxUser = function(checkbox, user_id) {
            for (var k in $scope.card.users)
            {
                if ($scope.card.users[k].users_id == user_id)
                {
                    checkbox.users.push($scope.card.users[k]);
                }
            }

            console.log(checkbox.users);
        };

        $scope.addUserToCheckbox = function(user_id) {
            $scope.checked_ids.push(user_id);
            $scope.updateUserList();
        };

        $scope.removeUserFromCheckbox = function(checkbox, user_id) {
            var temp = [];
            for (var k in checkbox.users)
            {
                if (checkbox.users[k].users_id != user_id)
                {
                    temp.push(checkbox.users[k]);
                }
            }

            checkbox.users = temp;

            $scope.updateUserList();
        };

        $scope.removeCheckboxUser = function(user_id) {
            var temp = [];
            for (var k in $scope.checked_ids)
            {
                if ($scope.checked_ids[k] != user_id)
                {
                    temp.push($scope.checked_ids[k]);
                }
            }
            $scope.checked_ids = temp;

            $scope.updateUserList();
        };

        $scope.updateUserList = function() {
            $scope.not_checked_users = [];
            $scope.checked_users = [];

            for (var k in $scope.checkbox_users)
            {
                if ($scope.inArray($scope.checked_ids, $scope.checkbox_users[k].users_id))
                {
                    $scope.checked_users.push($scope.checkbox_users[k]);
                }
                else
                {
                    $scope.not_checked_users.push($scope.checkbox_users[k]);
                }
            }

            if ($scope.not_checked_users != '') {
                $scope.add_checkbox_users_list = $scope.not_checked_users[0].users_id.toString();
            }
        };

        $scope.inArray = function(list, value) {
            var result = false;

            for (var k in list)
            {
                if (list[k] == value)
                {
                    result = true;
                }
            }

            return result;
        };

        $scope.addTempCheckboxDeadline = function() {
            //console.log($scope.checkbox_deadline.date.toDateString());
            var date = $scope.checkbox_deadline.date;

            $scope.temp_checkbox_deadline = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + $scope.checkbox_deadline.hour + ':' + $scope.checkbox_deadline.minute;
            $scope.showCheckboxDeadline = true;
        };

        $scope.removeTempCheckboxDeadline = function() {
            $scope.temp_checkbox_deadline = '';
        };

        $scope.changeCheckboxStatus = function(checkbox) {
            request.send('/TaskManager/changeCheckboxStatus', {'checkbox_id': checkbox.id, 'cards_id': $scope.card.cards_id}, function(data) {
                checkbox.status = data;
            });
        };

        /* END CHECKBOXES */

        ////////////////////////////////////

        /* COMMENTS */

        $scope.saveComment = function() {
            request.send('/TaskManager/saveComment', {'text': $scope.comment_text, 'cards_id': $scope.card.cards_id}, function(data) {
                $scope.card.comments = data;
                $scope.comment_text = '';
            });
        };

        /* END COMMENTS */

        ////////////////////////////////////

        $scope.getTeamUsers = function() {
            request.send('/TaskManager/getTeamUsers', {'cards_id': $scope.card.cards_id}, function(data) {
                $scope.team_users = data;
                if($scope.team_users){
                    $scope.users_list = $scope.team_users[0].users_id.toString();
                }
            });
        };

        $scope.addUserToCard = function(user_id) {
            request.send('/TaskManager/addUserToCard', {'users_id': user_id, 'cards_id': $scope.card.cards_id}, function(data) {
                $scope.getTeamUsers();
                $scope.card.users = data;
            });
        };

        $scope.removeUser = function(user_id) {
            request.send('/TaskManager/removeUser', {'users_id': user_id, 'cards_id': $scope.card.cards_id}, function(data) {
                $scope.getTeamUsers();
                $scope.card.users = data;
            });
        };

        $scope.makeDescriptionCopy = function() {
            $scope.old_description = angular.copy($scope.temp_description);
            $scope.show_description = ! $scope.show_description;
        };

        $scope.resetCardDescription = function() {
            $scope.card.description = $scope.old_description;
            $scope.temp_description = $scope.old_description;
            $scope.show_description = true;
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveCardDeadline = function() {
            request.send('/TaskManager/saveCardDeadline', {'cards_id': $scope.card.cards_id, 'deadline': $scope.card_deadline}, function(data) {
                $scope.card.deadline = data;
            });
        };

        $scope.removeCardDeadline = function() {
            request.send('/TaskManager/removeCardDeadline', {'cards_id': $scope.card.cards_id}, function(data) {
                $scope.card.deadline = data;
            });
        };

        $scope.dateOptions = {
            startingDay: 1,
            showWeeks: false
        };

        $scope.date = [{
            opened: false
        }, {
            opened: false
        }];

        $scope.calendarOpen = function(index) {
            $scope.date[index].opened = true;
        };

        $scope.setDate = function() {
            var checkbox_deadline_time = ($scope.checkbox_deadline_time) ? (new Date($scope.checkbox_deadline_time)) : (new Date());
            $scope.checkbox_deadline.hour = ((checkbox_deadline_time.getHours() < 10 ? '0' : '') + checkbox_deadline_time.getHours()).toString();
            $scope.checkbox_deadline.minute = ((checkbox_deadline_time.getMinutes() < 10 ? '0' : '') + checkbox_deadline_time.getMinutes()).toString();
            $scope.checkbox_deadline.date = ($scope.checkbox_deadline.date) ? (new Date($scope.checkbox_deadline.date)) : (new Date());

            var card_deadline_time = ($scope.card_deadline_time) ? (new Date($scope.card_deadline_time)) : (new Date());
            $scope.card_deadline.hour = ((card_deadline_time.getHours() < 10 ? '0' : '') + card_deadline_time.getHours()).toString();
            $scope.card_deadline.minute = ((card_deadline_time.getMinutes() < 10 ? '0' : '') + card_deadline_time.getMinutes()).toString();
            $scope.card_deadline.date = ($scope.card_deadline.date) ? (new Date($scope.card_deadline.date)) : (new Date());
        };

        $scope.setDate();

        $scope.range = function(n) {
            var list = [];
            for (var i = 0; i <= n; i++)
            {
                if (i < 10) {
                    var am = '0' + i;
                    list.push(am);
                }else {
                   list.push(i);
                }
            }
            return list;
        };
    };
})();

(function () {
    'use strict';

    angular.module('app').controller('ModalConfirmWindowCtrl', ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', '$filter', 'request', 'validate', 'logger', 'langs', 'items', ModalConfirmWindowCtrl]);

    function ModalConfirmWindowCtrl($rootScope, $scope, $uibModal, $uibModalInstance, $filter, request, validate, logger, langs, items) {
        console.log(items);

        if (items.deleted_item == 'checkbox') {
            $scope.delete = function() {
                request.send('/TaskManager/deleteCheckbox', items.checkbox, function(data) {
                    $uibModalInstance.close();
                });
            };
        }

        if (items.deleted_item == 'task') {
            $scope.delete = function() {
                request.send('/TaskManager/deleteTask', {'id': items.task.id}, function(data) {
                    $uibModalInstance.close();
                });
            };
        }

        if (items.deleted_item == 'desk') {
            $scope.delete = function() {
                request.send('/TaskManager/deleteDesk', items.desk, function(data) {
                    $uibModalInstance.close();
                });
            };
        }


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };
})();
