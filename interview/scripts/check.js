// Взрослая версия
// Перекидываем на конец теста если есть значение
if (localStorage.getItem("test-end")) {
    location.href = "/testing-end/?test-name=interview"
}
// Меняем название страницы
document.title = "Интервью"

// Если нету manager-id В ссылке то перекинет на страницу с просьбой получить актуальную ссылку
let URLParams = Object.fromEntries(new URLSearchParams(window.location.search))
// Если в строке нету значения manager-id или он не цифра или значение пустое
if (!URLParams.hasOwnProperty("manager-id") || isNaN(URLParams["manager-id"]) || URLParams["manager-id"] === "") {
    location.href = "/testing-end/?no-manager-id=true"
}

// Получем сохраненные данные о тестировании
let questionsHash = JSON.parse(localStorage.getItem("questionsHash_interview"))
let isQuestionsHash = questionsHash ? true : false // Была ли информация взята из кэша

// Если объект = null - делаем его пустым объектом
if (!isQuestionsHash) {
    questionsHash = {}
}