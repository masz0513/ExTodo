// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

class Todo {
  constructor() {
    this.todoListGroup = ".list-group"
    this.$todosContainer = $(".todos-container")

    this.todoTemplate = Handlebars.compile($("#todo-template").html())
    this.todosTemplate = Handlebars.compile($("#todos-template").html())

    this.displayClientCurrentDate()
    this.initGlobalAjaxEvent()

    this.toggleTodoEvent()
    this.newTodoEvent()
    this.deleteTodoEvent()
    this.deleteCompletedEvent()
    this.editTodoEvent()
    this.filterTodosEvent()
  }

  displayClientCurrentDate() {
    $(".todos-header-date").text((new Date()).toLocaleDateString())
  }

  initGlobalAjaxEvent() {
    const $spinner = $(".spinner");

    $(document).ajaxSend(function() {
      $spinner.show()
    }).ajaxComplete(function() {
      $spinner.hide()
    });
  }

  toggleTodoEvent() {
    $(this.todoListGroup).on("click", ".todos-item-toggle", function() {
      const $this = $(this)
      const $todoItem = $this.closest(".todos-item");
      const completed = $this.is(":checked");

      Todo.toggleTodoApi($todoItem.data("id"), completed, function(data) {
        $todoItem.find(".todos-item-label").toggleClass("completed", completed)
        Todo.updateStat(data.itemsLeftCount, data.hasCompleted)
      }, function(textStatus, errorThrown) {
        Todo.logError("toggleTodoEvent", textStatus, errorThrown)
      })
    });
  }

  newTodoEvent() {
    const $todoClass = this

    $(".todos-new").on("keypress", function(e) {
      const $this = $(this)
      const title = $this.val()

      if(e.keyCode === 13 && title) {
        Todo.newTodoApi(title, function(data) {
          const todo = {
            id: data.id,
            title: data.title
          }
          
          $todoClass.$todosContainer.append($todoClass.todoTemplate(todo))
          Todo.updateStat(data.itemsLeftCount, data.hasCompleted)
          $this.val("")
        }, function(textStatus, errorThrown) {
          Todo.logError("newTodoEvent", textStatus, errorThrown)
        })
      }
    })    
  }

  deleteTodoEvent() {
    $(this.todoListGroup).on("click", ".todos-item-delete", function() {
      if(!confirm("Do you really want to delete this todo?")){
        return
      }

      const $this = $(this)
      const $todoItem = $this.closest(".todos-item");

      Todo.deleteTodoApi($todoItem.data("id"), function(data) {
        Todo.updateStat(data.itemsLeftCount, data.hasCompleted)
        $todoItem.remove()
      }, function(textStatus, errorThrown) {
        Todo.logError("deleteTodoEvent", textStatus, errorThrown)
      })
    })
  }

  deleteCompletedEvent() {
    let $todoClass = this

    $(this.todoListGroup).on("click", ".todos-footer-clear", function() {
      if($(this).hasClass('disabled') || !confirm("Do you really want to delete all completed todos?")){
        return
      }

      const currentFilter = $(".todos-select[class='todos-util-active']").data("type") || "all"

      Todo.deleteCompletedApi(currentFilter.toLowerCase(), function(data) {
        let todos = []

        $.each(data.todos, function(i, t){
          todos.push({
            id: t.id,
            title: t.title,
            completed: t.completed
          })
        })

        const todosHtml = todos.length > 0 ? $todoClass.todosTemplate({todos}) : ""
        $todoClass.$todosContainer.html(todosHtml)

        Todo.updateStat(data.itemsLeftCount, data.hasCompleted)
      }, function(textStatus, errorThrown) {
        Todo.logError("deleteCompletedEvent", textStatus, errorThrown)
      })
    })
  }

  editTodoEvent() {
    $(this.todoListGroup).on("dblclick", ".todos-item-label", function() {
      const $todoItem = $(this).closest(".todos-item");

      $todoItem.find(".todos-item-normal-view").toggleClass("hide")
      $todoItem.find(".todos-item-edit-view").toggleClass("hide")
    })

    $(this.todoListGroup).on("keypress", ".todos-item-edit-view", function(e) {
      if(e.keyCode === 13) {
        const $this = $(this)
        const $todoItem = $this.closest(".todos-item");
        
        const id = $todoItem.data("id")
        const newTitle = $this.val()

        Todo.editTodoApi(id, newTitle, function(data) {
          $todoItem.find(".todos-item-label").text(newTitle)
          $todoItem.find(".todos-item-normal-view").toggleClass("hide")
          $todoItem.find(".todos-item-edit-view").toggleClass("hide")
        }, function(textStatus, errorThrown) {
          Todo.logError("editTodoEvent", textStatus, errorThrown)
        })
      }
    })
  }


  filterTodosEvent() {
    let $todoClass = this
    var $container = $(".todos-utils")

    $container.on("click", ".todos-select", function() {
      var $this = $(this)

      if($this.hasClass("todos-util-active")){
        return;
      }

      Todo.filterTodosApi($this.data("type"), function(data){
        let todos = []

        $.each(data.todos, function(i, t){
          todos.push({
            id: t.id,
            title: t.title,
            completed: t.completed
          })
        })

        const todosHtml = todos.length > 0 ? $todoClass.todosTemplate({todos}) : ""
        $todoClass.$todosContainer.html(todosHtml)

        Todo.updateStat(data.itemsLeftCount, data.hasCompleted)

        $container.find(".todos-util-active").removeClass("todos-util-active")
        $this.addClass("todos-util-active")
      }, function(textStatus, errorThrown) {
        Todo.logError("filterTodosEvent", textStatus, errorThrown)
      })
    })
  }

  // --- Utilities --- //
  static logError(title, textStatus, errorThrown) {
    console.log("-- " + title + " -- ")
    console.log("textStatus: " + textStatus)
    console.log("errorThrown: " + errorThrown)
    alert("Unable to process your request. Please try again.")
  }

  static updateStat(itemsLeftCount, hasCompleted) {
    $(".todos-footer-stat").text(itemsLeftCount)
    $(".todos-footer-clear").toggleClass("disabled", !hasCompleted)
  }

  // apis
  static toggleTodoApi(id, completed, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "PATCH",
      url: "/api/todos/" + id,
      data: {
        completed: completed,
        title: "_"
      }
    }), doneCallback, failCallback)
  }

  static newTodoApi(title, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "POST",
      url: "/api/todos",
      data: {
        title: title
      }
    }), doneCallback, failCallback)
  }

  static deleteTodoApi(id, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "DELETE",
      url: "/api/todos/" + id
    }), doneCallback, failCallback)
  }

  static deleteCompletedApi(currentFilter, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "DELETE",
      url: "/api/todos?current_filter=" + currentFilter
    }), doneCallback, failCallback)
  }

  static editTodoApi(id, newTitle, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "PUT",
      url: "/api/todos/" + id,
      data: {
        title: newTitle
      }
    }), doneCallback, failCallback)
  }

  static filterTodosApi(filter, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "GET",
      url: "/api/todos?filter=" + filter
    }), doneCallback, failCallback)
  }

  static apiWhen(ajaxCall, doneCallback, failCallback) {
    $.when(ajaxCall).then(function(data){
      if(doneCallback) {
        doneCallback(data)
      }
    }, function(jqXHR, textStatus, errorThrown) {
      if(failCallback) {
        failCallback(textStatus, errorThrown)
      }
    })
  }
}

$(() => new Todo)
