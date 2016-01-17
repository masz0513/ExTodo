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
    this.displayClientCurrentDate()
    this.initGlobalAjaxEvent()
    this.toggleTodoEvent()
  }

  displayClientCurrentDate() {
    $(".todos-header-date").text((new Date()).toLocaleDateString())
  }

  initGlobalAjaxEvent() {
    var $spinner = $(".todos-spinner");

    $(document).ajaxSend(function() {
      $spinner.show()
    }).ajaxComplete(function() {
      $spinner.hide()
    });
  }

  toggleTodoEvent() {
    $(this.todoListGroup).on("click", ".todos-item-toggle", function() {
      var $this = $(this)
      var $todoItem = $this.closest(".todos-item");
      var completed = $this.is(":checked");

      Todo.toggleApi($todoItem.data("id"), completed, function(data) {
        $todoItem.find(".todos-item-label").toggleClass("completed", completed)
        $(".todos-footer-stat").text(data.itemsLeftCount)
        $(".todos-footer-clear").toggleClass("disabled", !data.hasCompleted)
      }, function(textStatus, errorThrown) {
        Todo.logError("toggleTodoEvent", textStatus, errorThrown)
      })
    });
  }

  static logError(title, textStatus, errorThrown) {
    console.log("-- " + title + " -- ")
    console.log("textStatus: " + textStatus)
    console.log("errorThrown: " + errorThrown)
    alert("Unable to process your request. Please try again.")
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
