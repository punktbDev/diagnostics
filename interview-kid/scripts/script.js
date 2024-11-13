    // Если пользователь валидно заполнил форму и данные сохранились в хэш, то заполняем поля
    let hashUserFormData = JSON.parse(localStorage.getItem("userFormData"))
    if (hashUserFormData) {
        $("#form-name").val(hashUserFormData.formName)
        $("#form-phone").val(hashUserFormData.formPhone)
        $("#form-email").val(hashUserFormData.formEmail)
        // Активируем галочку
        $("#policy").toggleClass("checked")
    }


    $("#form-name").change(() => { // Удаление лишних пробелов
        $("#form-name").val($("#form-name").val().replace(/ +/g, ' ').trim())
    })

    $("#form-phone").change(() => { // Удаление пробелов
        $("#form-phone").val($("#form-phone").val().replace(/ /g,''))
    })

    $("#form-email").change(() => { // Удаление пробелов
        $("#form-email").val($("#form-email").val().replace(/ /g,''))
    })


    // Галочка 
    $("#policy").on("click tap", () => {
        $("#policy").toggleClass("checked")
    })

    // Клик тексту после галочки
    $("#label-policy").on("click tap", () => {
        $("#policy").addClass("checked")
    })

    // Клик по политике
    $("#label-policy span").on("click tap", () => {
        window.open(POLICY_URL, "_blank")
    })


    // Ивент submit у формы входа
    const form = document.querySelector('form')
    form.addEventListener('submit', (event) => {
        // Отключение базового перехода
        event.preventDefault()

        // Отключаем кнопку на 2 секунды
        $("#submit-form").attr("disabled", "disabled")
        setTimeout(() => {
            $("#submit-form").removeAttr("disabled")
        }, 2000)


        // Получаем поля из фомы
        const formData = new FormData(form)
        const formName = formData.get("form-name")
        const formPhone = formData.get("form-phone")
        const formEmail = formData.get("form-email")
        
        // В поле ФИО должно быть ровно 3 слова
        if (formName.split(" ").length !== 3) {
            inputError("#form-name")

            // Ставим текст ошибки
            $("#form-error").text("Неверный формат ФИО")
            $("#form-error").addClass("show")
            setTimeout(() => {
                $("#form-error").removeClass("show")
            }, 2000)
            return
        }

        // Проверка поля Телефона на регулярном выражении
        let rePhone = /^[\d\+][\d\(\)\ -]{9,14}\d$/
        if (!rePhone.test(formPhone)) {
            inputError("#form-phone")
            // Ставим текст ошибки
            $("#form-error").text("Неверный номер телефона")
            $("#form-error").addClass("show")
            setTimeout(() => {
                $("#form-error").removeClass("show")
            }, 2000)
            return
        }

        // Проверка поля Почты на регулярном выражении
        let reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i
        if (!reEmail.test(formEmail)) {
            inputError("#form-email")
            // Ставим текст ошибки
            $("#form-error").text("Неверный email")
            $("#form-error").addClass("show")
            setTimeout(() => {
                $("#form-error").removeClass("show")
            }, 2000)
            return
        }

        if (!$("#policy").hasClass("checked")) {
            // Ставим текст ошибки
            $("#form-error").text("Отметьте поле")
            $("#form-error").addClass("show")
            setTimeout(() => {
                $("#form-error").removeClass("show")
            }, 2000)
            return
        }


        $("#form-aside").addClass("hidden")
        $("#form-section").addClass("hidden")
        $("#section-title").removeClass("hidden")
        $("#section-content").removeClass("hidden")

        // Класс для корректного отображения
        $("article").addClass("article-content")



        // Сохраняем информацию в хэш
        let userFormData = {
            formName: formName,
            formPhone: formPhone,
            formEmail: formEmail,
        }

        localStorage.setItem("userFormData", JSON.stringify(userFormData))

        // Когда заполнили все поля и нажали "Далее", то рендерит Правила
    })



    // Вернуться обратно в форму
    $("#button-back").on("click tap", () => {
        $("#form-aside").removeClass("hidden")
        $("#form-section").removeClass("hidden")
        $("#section-title").addClass("hidden")
        $("#section-content").addClass("hidden")

        // Класс для корректного отображения
        $("article").removeClass("article-content")
    })


    // Автозаполнение полей с ответами
    if (isQuestionsHash) {
        for (inputId in questionsHash) {
            $("#" + inputId).val(questionsHash[inputId])
        }
    }


    // Сохранение ответов
    $(".section-inputs__block textarea").on("input", (event) => {
        let inputId = event.currentTarget.id
        questionsHash[inputId] = $("#" + inputId).val()

        // Сохраняем ответы после записи
        localStorage.setItem("questionsHash_interviewKid", JSON.stringify(questionsHash))


        // Если всего ответов 3
        if (Object.keys(questionsHash).length === 3) {
            // Если нету пустых ответов
            if (!Object.values(questionsHash).includes("")) {
                $("#button-end").removeAttr("disabled")
            } else {
                // Если есть, то ставим кнопку неактивной
                $("#button-end").attr("disabled", "disabled")
            }
        }
    })

    $(".section-inputs__block textarea").change((event) => {
        $("#" + event.currentTarget.id).val($("#" + event.currentTarget.id).val().replace(/ +/g, ' ').trim())
    })

    // Триггерим инпуты, что бы при заполненых ответах кнопка разблокировалась
    $(".section-inputs__block textarea").trigger("input")

    
    // Отправка ответов
    $("#button-end").on("click tap", () => {
        $("#button-end").attr("disabled", "disabled")
        setTimeout(() => {
            $("#button-end").removeAttr("disabled")
        }, 5000)

        // Проверка, если не все поля заполнены
        if (Object.values(questionsHash).includes("")) {
           return
        }

        // Получаем информацию о пользователе
        let userFormData = JSON.parse(localStorage.getItem("userFormData"))
        
        // Массив который отправиться
        let sendData = {
        // id: Установиться в google scripts
            "manager_id": parseInt(URLParams["manager-id"]),
            "name": userFormData.formName,
            "phone": userFormData.formPhone,
            "email": userFormData.formEmail,
            "new": true,
            "result": {
                "diagnostic-id": 9, // Для этой диагностики id = 9 (Детская версия)
                "data": questionsHash,
                "date": Date.now() // Дата текущего прохождения
            },
            "in_archive": false,
            "date": Date.now() // Дата последней активности
        }
        
        // Api запрос в таблицу с результатами
        function DBsendResults(data, func) {
            $.ajax({
                url: API_URL + "/client/result",
                method: "POST",
                data: JSON.stringify(data),
                success: func
            })
        }

        DBsendResults(sendData, (data) => {
            // Информация отправляется и перекидывает на конец тестирования

            // Добавляем значение в хэш что бы после перезагрузки перекинуло на концовку
            localStorage.setItem("test-end", "test-end")
            location.reload()
        })
    })



// Замена видео на вк-видео
if (URLParams.vk !== undefined) {
    $(".iframe-wrapper iframe").remove()
    $(".iframe-wrapper").prepend(`<iframe src="https://vk.com/video_ext.php?oid=-226977867&id=456239018&hash=8e391e16f526dc9d" width="426" height="240" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`)
}