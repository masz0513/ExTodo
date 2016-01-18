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
  }

  displayClientCurrentDate() {
    $(".todos-header-date").text((new Date()).toLocaleDateString())
  }

  initGlobalAjaxEvent() {
    let $spinner = $(".spinner");

    $(document).ajaxSend(function() {
      $spinner.show()
    }).ajaxComplete(function() {
      $spinner.hide()
    });
  }

  toggleTodoEvent() {
    $(this.todoListGroup).on("click", ".todos-item-toggle", function() {
      let $this = $(this)
      let $todoItem = $this.closest(".todos-item");
      let completed = $this.is(":checked");

      Todo.toggleApi($todoItem.data("id"), completed, function(data) {
        $todoItem.find(".todos-item-label").toggleClass("completed", completed)
        Todo.updateStat(data.itemsLeftCount, data.hasCompleted)
      }, function(textStatus, errorThrown) {
        Todo.logError("toggleTodoEvent", textStatus, errorThrown)
      })
    });
  }

  newTodoEvent() {
    let $todoClass = this

    $(".todos-new").on("keypress", function(e) {
      let $this = $(this)
      let title = $this.val()

      if(e.keyCode === 13 && title) {
        Todo.newTodoApi(title, function(data) {
          let todo = {
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
  static toggleApi(id, completed, doneCallback, failCallback) {
    Todo.apiWhen($.ajax({
      type: "PUT",
      url: "/api/todos/toggle/" + id,
      data: {
        completed: completed
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
