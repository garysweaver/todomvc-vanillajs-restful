var TODOS_BASE_URL = "http://localhost:8080/todomvc-services-javaee6/todos";

function hideWarningIfServiceIsWorking() {
    alert("this happened. url=" + TODOS_BASE_URL);
    var req = new XMLHttpRequest();
    req.open("GET", TODOS_BASE_URL, false);
    req.setRequestHeader("Content-type", "application/json");
    req.send(null);
    if (req.status == 200) {
        alert("this also happened. url=" + TODOS_BASE_URL);
       document.getElementById("warning").style.display = "none";
    }
    else {
        alert("this didn't work");
    }
}
hideWarningIfServiceIsWorking();

var todos = [],
    stat = {},
    ENTER_KEY = 13,
    passedValue = false,
    processTodoIndex = 0;

window.addEventListener( "load", windowLoadHandler, false );

function call(method, uri, data, successCallback, failureCallback)
{
    json = data ? JSON.stringify(data) : null;

    $.ajax({
        type: method,
        data: json,
        url: uri,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successCallback,
        failure: failureCallback
});
}

// not guaranteed to be unique, but close enough for now.
// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function getUniqueId() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// partially from http://usefulscripts.wordpress.com/2007/10/16/javascript-for-setting-session-id-and-visitor-id-cookies/
function getUser() {
   var start = document.cookie.indexOf("todomvc_example_owner=");
   var len = start+name.length+1;
   if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
   if (start == -1) return null;
   var end = document.cookie.indexOf(";",len);
   if (end == -1) end = document.cookie.length;
   return unescape(document.cookie.substring(len,end));
}
function establishUser() {
    // use date that expires in 10 years
    document.cookie = "todomvc_example_owner=" + getUniqueId() + ";expires=" + (new Date().getTime() + 315360000000) + ";path=/";
}

function Todo( title, completed ) {
    this.title = title;
    this.completed = completed;
}

function Stat() {
    this.todoLeft = 0;
    this.todoCompleted = 0;
    this.totalTodo = 0;
}

function windowLoadHandler() {
    loadTodos();
    refreshData();
    addEventListeners();
}

function addEventListeners() {
    document.getElementById( 'new-todo' ).addEventListener( "keypress", newTodoKeyPressHandler, false );
    document.getElementById( 'toggle-all' ).addEventListener( "change", toggleAllChangeHandler, false );
}

function inputEditTodoKeyPressHandler( event ) {
    var inputEditTodo,
        trimmedText,
        todoId;

    inputEditTodo = event.target;
    trimmedText = inputEditTodo.value.trim();
    todoId = event.target.id.slice( 6 );

    if ( trimmedText ) {
        if ( event.keyCode === ENTER_KEY ) {
            editTodo( todoId, trimmedText );
        }
    }
    else {
        removeTodoById( todoId );
        refreshData();
    }
}

function inputEditTodoBlurHandler( event ) {
    var inputEditTodo,
        todoId;

    inputEditTodo = event.target;
    todoId = event.target.id.slice( 6 );
    editTodo( todoId, inputEditTodo.value );
}

function newTodoKeyPressHandler( event ) {
    if ( event.keyCode === ENTER_KEY ) {
        addTodo( document.getElementById( 'new-todo' ).value );
    }
}

function updateCheckboxAndCheckRecursively(todo) {
    todo.completed = passedValue;
    call("PUT", TODOS_BASE_URL, todo, getCheckboxAndCheckRecursively, error);
}

function getCheckboxAndCheckRecursively() {
    processTodoIndex = processTodoIndex - 1;
    if (processTodoIndex > -1) {        
        call("GET", TODOS_BASE_URL + "/" + processTodoIndex, null, getCheckboxAndCheckRecursively, error);
    }
    getAllAndRefreshData();
}

function toggleAllChangeHandler( event ) {
    // TODO: RESTfully set completed status of ids...?
    passedValue = event.target.checked;
    // hack: this looks wrong but we decrement index in the next method
    processTodoIndex = todos.length;
    getCheckboxAndCheckRecursively();
}

function spanDeleteClickHandler( event ) {
    removeTodoById( event.target.getAttribute( 'data-todo-id' ) );
}

function hrefClearClickHandler() {
    removeTodosCompleted();
}

function todoContentHandler( event ) {
    var todoId,
        div,
        inputEditTodo;

    todoId = event.target.getAttribute( 'data-todo-id' );
    div = document.getElementById( 'li_'+todoId );
    div.className = 'editing';

    inputEditTodo = document.getElementById( 'input_' + todoId );
    inputEditTodo.focus();
}

function error() {
    alert("Failed to connect to server. Reload page and try again later.");
}

function updateCheckbox(todo) {
    todo.completed = passedValue;
    call("PUT", TODOS_BASE_URL, todo, getAllAndRefreshData, error);
}

function checkboxChangeHandler( event ) {
    var checkbox = event.target;    
    passedValue = checkbox.checked;
    alert("Checkbox is now (true or false): " + passedValue);
    // TODO: need to json escape that value
    call("GET", TODOS_BASE_URL + "/" + checkbox.getAttribute( 'data-todo-id' ), null, updateCheckbox, error);
}

function loadTodos() {
    getAllAndRefreshData();
}

function setDataAndRefresh(someData) {
    todos = someData;
    refreshData();
}

function getAllAndRefreshData() {
    call("GET", TODOS_BASE_URL, null, setDataAndRefresh, error)
}

function addTodo( text ) {
    var trimmedText = text.trim();

    if ( trimmedText ) {
        var todo = new Todo( trimmedText, false );
        call("PUT", TODOS_BASE_URL, todo, getAllAndRefreshData, error);
    }
}

function editTodo( todoId, text ) {
    call("PUT", TODOS_BASE_URL, todo, getAllAndRefreshData, error);
}

function removeTodoById( id ) {
    call("DELETE", TODOS_BASE_URL + "/" + id, null, getAllAndRefreshData, error);
}

function deleteDoneRecursively() {
    processTodoIndex = processTodoIndex - 1;
    alert("deleteDoneRecursively. processTodoIndex=" + processTodoIndex);
    if (processTodoIndex > -1) {
        alert("todos[processTodoIndex].completed=" + todos[processTodoIndex].completed);
        if (todos[processTodoIndex].completed) {
            alert("Deleting " + processTodoIndex);
            call("DELETE", TODOS_BASE_URL + "/" + processTodoIndex, null, deleteDoneRecursively, error);
        }
        else {
            deleteDoneRecursively();        
        }
    }
    alert("deleteDoneRecursively done");
    getAllAndRefreshData();
}

function removeTodosCompleted() {
    alert("removeTodosCompleted started");
    // hack: this looks wrong but we decrement index in the next method
    processTodoIndex = todos.length;
    deleteDoneRecursively();
}

function refreshData() {
    computeStats();
    redrawTodosUI();
    redrawStatsUI();
    changeToggleAllCheckboxState();
}

function computeStats() {
    var i;

    stat = new Stat();
    stat.totalTodo = todos.length;
    for ( i=0; i < todos.length; i++ ) {
        if ( todos[i].completed ) {
            stat.todoCompleted += 1;
        }
    }
    stat.todoLeft = stat.totalTodo - stat.todoCompleted;
}


function redrawTodosUI() {

    var ul,
        todo,
        checkbox,
        label,
        deleteLink,
        divDisplay,
        inputEditTodo,
        li,
        i;

    ul = document.getElementById( 'todo-list' );

    document.getElementById( 'main' ).style.display = todos.length ? 'block' : 'none';

    ul.innerHTML = "";
    document.getElementById( 'new-todo' ).value = '';

    for ( i= 0; i < todos.length; i++ ) {
        todo = todos[i];

        // create checkbox
        checkbox = document.createElement( 'input' );
        checkbox.className = 'toggle';
        checkbox.setAttribute( 'data-todo-id', todo.id );
        checkbox.type = 'checkbox';
        checkbox.addEventListener( 'change', checkboxChangeHandler );

        // create div text
        label = document.createElement( 'label' );
        label.setAttribute( 'data-todo-id', todo.id );
        label.appendChild( document.createTextNode( todo.title ) );


        // create delete button
        deleteLink = document.createElement( 'button' );
        deleteLink.className = 'destroy';
        deleteLink.setAttribute( 'data-todo-id', todo.id );
        deleteLink.addEventListener( 'click', spanDeleteClickHandler );

        // create divDisplay
        divDisplay = document.createElement( 'div' );
        divDisplay.className = 'view';
        divDisplay.setAttribute( 'data-todo-id', todo.id );
        divDisplay.appendChild( checkbox );
        divDisplay.appendChild( label );
        divDisplay.appendChild( deleteLink );
        divDisplay.addEventListener( 'dblclick', todoContentHandler );


        // create todo input
        inputEditTodo = document.createElement( 'input' );
        inputEditTodo.id = 'input_' + todo.id;
        inputEditTodo.className = 'edit';
        inputEditTodo.value = todo.title;
        inputEditTodo.addEventListener( 'keypress', inputEditTodoKeyPressHandler );
        inputEditTodo.addEventListener( 'blur', inputEditTodoBlurHandler );


        // create li
        li = document.createElement( 'li' );
        li.id = 'li_' + todo.id;
        li.appendChild( divDisplay );
        li.appendChild( inputEditTodo );


        if ( todo.completed )
        {
            li.className += 'complete';
            checkbox.checked = true;
        }

        ul.appendChild( li );
    }


}

function changeToggleAllCheckboxState() {
    var toggleAll = document.getElementById( 'toggle-all' );
    if ( stat.todoCompleted === todos.length ) {
        toggleAll.checked = true;
    } else {
        toggleAll.checked = false;
    }
}

function redrawStatsUI() {
    removeChildren( document.getElementsByTagName( 'footer' )[ 0 ] );
    document.getElementById( 'footer' ).style.display = todos.length ? 'block' : 'none';

    if ( stat.todoCompleted > 0 ) {
        drawTodoClear();
    }

    if ( stat.totalTodo > 0 ) {
        drawTodoCount();
    }
}

function drawTodoCount() {

    var number,
        theText,
        remaining;
    // create remaining count
    number = document.createElement( 'strong' );
    number.innerHTML = stat.todoLeft;
    theText = ' item';
    if ( stat.todoLeft !== 1 ) {
        theText += 's';
    }
    theText += ' left';

    remaining = document.createElement( 'span' );
    remaining.id = 'todo-count';
    remaining.appendChild( number );
    remaining.appendChild( document.createTextNode( theText ) );

    document.getElementsByTagName( 'footer' )[ 0 ].appendChild( remaining );
}

function drawTodoClear() {

    var buttonClear = document.createElement( 'button' );
    buttonClear.id = 'clear-completed';
    buttonClear.addEventListener( 'click', hrefClearClickHandler );
    buttonClear.innerHTML = 'Clear completed (' + stat.todoCompleted + ')';


    document.getElementsByTagName( 'footer' )[ 0 ].appendChild( buttonClear );
}


function removeChildren( node ) {
    node.innerHTML = '';
}