(function() {
  let key;

  // создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');
    button.disabled = true;

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создаём и возвращаем список элементов
  function createTodoList(tasks) {
    let list = document.createElement('ul');
    list.classList.add('list-group');

    if (typeof tasks == 'string') tasks = [];

    let array = JSON.parse(localStorage.getItem(key));

    if (array == null) {
      localStorage.setItem(key, JSON.stringify(tasks));
    } else { tasks = array }

    if (tasks.length) {
      for (let task of tasks) {
        list.append(createTodoItem(task).item); }
    }

    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement('li');

    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    if (typeof name == 'object') {
      item.textContent = name.name;
      if (name.done) item.classList.add('list-group-item-success');
    } else { item.textContent = name };

    // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', function() {
      let array = JSON.parse(localStorage.getItem(key));
      item.classList.toggle('list-group-item-success');

      if (item.classList.contains('list-group-item-success')) {
        for (let element of array) {
          if (element.name == name || element.name == name.name) element.done = true;
        }
      } else {
        for (let element of array) {
          if (element.name == name || element.name == name.name) element.done = false;
        }
      }

      localStorage.setItem(key, JSON.stringify(array));
    });

    deleteButton.addEventListener('click', function() {
      let array = JSON.parse(localStorage.getItem(key));

      if (confirm('Вы уверены?')) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].name == name || array[i].name == name.name) array.splice(i, 1);
        }

        item.remove();
      }

      localStorage.setItem(key, JSON.stringify(array));
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp( container, title, tasks = [] ) {
    key = title;

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList(tasks);

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.input.addEventListener('input', function() {
      if (todoItemForm.input.value != false) {
        todoItemForm.button.removeAttribute('disabled');
      } else { todoItemForm.button.disabled = true; }
    });

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      let array = JSON.parse(localStorage.getItem(key));

      for (let element of array) {
        if (element.name == todoItemForm.input.value) {
          alert('Такое дело уже добавлено!');

          todoItemForm.button.disabled = true; 

          todoItemForm.input.value = "";

          return;
        } 
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      todoList.append(todoItem.item);

      (function() {
        let itemObj = {};

        itemObj.name = todoItemForm.input.value;

        tasks = array;

        tasks.push(itemObj);

        localStorage.setItem(key, JSON.stringify(tasks));
      })();

      todoItemForm.input.value = "";

      todoItemForm.button.disabled = true;
    })
  }

  window.createTodoApp = createTodoApp;
})();


