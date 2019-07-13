import $ from 'jquery';
import 'bootstrap';
import './scss/app.scss';
import Todo from './todo.js';
var id = 1;

const app = (function() {
    const todos = [];
    const $todoUl = $("#todo");
    const $todoInput = $("#todo-input")
    const todoItemTemplate = $("#item-template").html();
    const pendingTemplate = $("#pending-template").html();
    const doneTemplate = $("#done-template").html();

    function init() {
        bindEvents();
    }

    function bindEvents() {
        $("#add-btn").on("click", function() {
            const newTodo = new Todo($todoInput.val());
            $todoInput.val('');
            addTodo(newTodo);
        });
    }

    function displayStats() {
        var count = todos.filter(t => t.done).length;
        $("#stats").text(`Total: ${todos.length}, Pending: ${todos.length - count}, Done: ${count}`);
    }

    function addTodo(todo) {
        todos.push(todo);
        const todoEl = $(todoItemTemplate.replace("{{data}}", todo.text).replace("{{id}}", id))
        todo.id = id;
        id++;
        todoEl.find('.status').append(todo.done ? $(doneTemplate) : $(pendingTemplate))
        todoEl.find('.toggle').html(todo.done ? "Mark as Pending" : "Mark as Done")
        $todoUl.append(todoEl);
        displayStats();

        todoEl.find(".toggle").on("click", function(e) {
            e.stopPropagation();
            const $itemEl = $(e.target).closest('li');
            const index = parseInt($itemEl.attr("data-id"));
            const current = todos.find(x => x.id == index);
            current.done = !current.done;

            if (current.done) {
                $(e.target).text("Mark as Pending");
            } else {
                $(e.target).text("Mark as Done");
            }
            $itemEl.find('.status').html(current.done ? $(doneTemplate) : $(pendingTemplate));
            displayStats();
        });

        todoEl.find(".remove").on("click", function(e) {
            e.stopPropagation();
            const $itemEl = $(e.target).closest('li');
            const index = parseInt($itemEl.attr("data-id"));
            const findIndex = todos.findIndex(x => x.id == index);
            todos.splice(findIndex, 1);
            $itemEl.remove();
            displayStats();
        });
    }

    return {
        init: init,
        addTodo: addTodo
    }
})();


app.init();
app.addTodo(new Todo("Buy cat food"));
app.addTodo(new Todo("Feed cat"));
var c = new Todo("Buy milk")
c.done = true;
app.addTodo(c);