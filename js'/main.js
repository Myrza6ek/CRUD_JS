//! ========= CRUD todo ======

// Creare - создание / добавление новых данных
// Read - отображение данных
// Update - изменение (обновление) существующих данных
// Delete - удаление всех данных или только выбранных

// сохраняем в переменной основные теги из HTML
let btn = document.getElementById("btnAdd");
let inpTask = document.getElementById("inpTask");
let list = document.getElementById("task-list");

//todo ============== Create  Start ==============

//создаем функцию для вызова в других местах (для упрощения). При создании принимается один параметр, который отвечает за новый объект("task")

function createTask(liTask) {
  // проверка на наличие в локал сторедж ключа под названием "tasks"/ если такого ключа нет, то условие создаст это хранилище и первым значением отправит пустой массив
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", "[]");
  }
  // стягиваем информацию из локал сторедж и сохраняем её в переменную "data" (это массив)
  let data = JSON.parse(localStorage.getItem("tasks"));

  // в наш массив добавляем новые данные. Информацией здесь является параметр функции liTаsk (это объект с одним ключом task)
  data.push(liTask);

  // измененный массив отправляем обратно в локал сторедж
  localStorage.setItem("tasks", JSON.stringify(data));
}

//? навешиваем событие на кнопку для отправки данных

btn.addEventListener("click", () => {
  // trim - не учитывает первые пробелы
  // проверка на заполненность инпута, чтобы не отправлили путоту
  if (!inpTask.value.trim()) {
    alert("заполните поле");
    return;
  }
  // создаем новый объект с одним ключом task, а значением ключа будет значение инпута
  let obj = {
    task: inpTask.value,
  };

  // вызываем функцию создания нового таска и в аргументы передаеим вышесозданный объект, в качестве новой информации
  createTask(obj);

  // Вызываем функцию отображения данных для того, чтобы сразу эе после отправки данных все отобразилось на странице
  readTask();

  // чтобы текст в инпуте не оставался после отправки , сразу же очищаем
  inpTask.value = "";
});
//todo ============== Create  Finish ==============

//todo ============== Read - отображение ===============
//? ============= Read Start ===============
function readTask() {
  // проверка на наличие в локал сторедж ключа под названием "tasks"/ если такого ключа нет, то условие создаст это хранилище и первым значением отправит пустой массив
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", "[]");
  }

  // стягиваем информацию из локал сторедж и сохраняем её в переменную "data" (это массив)
  let data = JSON.parse(localStorage.getItem("tasks"));
  // очищаем внутренний код в теге ul, для того чтобы не созздавались при переборе массива
  list.innerHTML = "";
  // стянутый массив перебираем для того чтобы на каждый элемент массива создать отдельный тег li и отобразить там все данные
  data.forEach((item, index) => {
    // создаем новый элемент тег li и сохраняем в переменную li
    let li = document.createElement("li");
    // в переменную добавляем текст который  хранится в каждом элементе массива(здесь Элементы - это обхекты, а в каждом объекте есть ключ task)
    li.innerText = item.task; // в item.task лежит информация из инпутов
    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Удалить";
    // вышесозданную кнопку "удалить" добавляем в тег li
    li.append(btnDelete);
    btnDelete.addEventListener("click", () => {
      // при каждом клике на кнопу "удалить" вызываем функцию удаления, в аргументы передаем индекс элемента на который кликнули. индекс берем из параметра колбэк функции метода forEach
      deleteTask(index);
    });
    let btnEdit = document.createElement("button");
    btnEdit.innerText = "Изменить";
    li.append(btnEdit);
    btnEdit.addEventListener("click", () => {
      editTask(index, item); // при каждом клике кнопки изменить вызываем функцию редактирования. а в аргументы передаем: 1 - индекс элемента на которую кликнули, 2 - сам элемент на который кликнули(здесь Объект с ключом task)
    });
    // после всех созданий кнопок и тегов добавляем окончательный результакт Li тега в ul список
    list.append(li);
  });
}

//? ============= Read finish===============

//todo Delete =============== Старт
function deleteTask(index) {
  let data = JSON.parse(localStorage.getItem("tasks"));
  data.splice(index, 1); // обращаемся массиву с данными и с помощью метода сплайс удаляем элемент на котором кликнули кнопку "удалить"
  // индекс берется из параметра данной функции

  //измененный массив отправляю обратно в локал сторэдж
  localStorage.setItem("tasks", JSON.stringify(data));
  // вызываем функцию отображения данных , для того чтобы при удалении на странице сразу же обновились информация автоматически, не нажимая в верхнем правом углу
  readTask();
}
// todo delet ===============finish

//todo Edit =============== Старт

// сохр-м перем-е теги для модал окна из HTML

let btnSave = document.getElementById("btnSave");

let mainModal = document.querySelector(".main-modal");
let innerModal = document.getElementById("innerModal");

// один из способов передачи информации из одной области в другую облать видимости
// let boxIndex = document.querySelector(".boxIndex");

//второй способ передачи инф-ии
let id = "";

//создаем функцию
function editTask(index, item) {
  // при нажатии кнопку "изменить" отоюражаем модальн окно, у которой изначально св-во диспл - нон
  mainModal.style.display = "block";

  innerModal.value = item.task;
  // boxIndex.setAttribute("id", index);

  //в глобальную переменную id сохр=м парам данной функц.(где хранится индекс с элементом )
  id = index;
}

//====навешиваем событие================
btnSave.addEventListener("click", () => {
  if (innerModal.value.trim() === "") {
    alert("Заполните поле!");
    return;
  }
  let data = JSON.parse(localStorage.getItem("tasks"));
  // создаем новый объект с ключом task, а знаением ключа будет значение ключа в модальном окне
  let editedTask = {
    task: innerModal.value,
  };

  // обращаемся к стянутому массиву и используем метод сплайс для замены для изменения информации. Первым ааргументом передаем переменную ID которая находится в глобальной области. второй аргум кол-во изменяемых жлем-в. 3 аргум на что хотим изм-ть. (здесь вышесозд-й объект)
  data.splice(id, 1, editedTask);
  // измен-ый массив отпр-м в локал стордж
  localStorage.setItem("tasks", JSON.stringify(data));
  // сразу же после отправки закрываем модальное окно

  mainModal.style.display = "none";
  // после нажатия кнопки сохранить отображаем все изменения на странице без нажатия кнопки обновить
  readTask();
});

let btnCloseModal = document.getElementById("btnCloseModal");
btnCloseModal.addEventListener("click", () => {
  mainModal.style.display = "none";
});
// todo  ========= finish

// один раз вызываем функцию для отображения данных в глоб обл видим, для того чтобы чел-к зайдя на сайт увидел все данные, которые у него были до недавнего времени. Если не вызыв эту функц то при посещен сайта, наша страница будет пустой.
readTask();
