// поле вывода времени
const field_hour = document.querySelector('.hour');
const field_minute = document.querySelector('.minute');
const field_second = document.querySelector('.second');
const field_millisecond = document.querySelector('.msecond');
// buttons
const btnStart = document.querySelector('.start');
const btnPause = document.querySelector('.pause');
const btnStop = document.querySelector('.stop');
const btnCount = document.querySelector('.count');


const resultLimit = 999;
let interval;
let hour = 0, minute = 0, second = 0, millisecond = 0;
let startLog = 0, pauseLog = 0, stopLog = 0;
let results = {}


// добавление лидирующих нулей
function is_9(a){
	if(a < 10){a = '0' + a;}
	return a;
}


// основная функция, вызывается в setInterval()
// вычисление минут, секунд и пр. со старта
function startTimer(){
	// разница относительно старта и всех пауз
	let time = Date.now() - results.start - results.pauseTime;

	// миллисекунды
	millisecond = Math.round((time%1000)/10);

	time = Math.floor(time/1000);   // общее количество секунд
	if(time > results.second){
		results.second = time;
		second = time%60;
		time -= second;

		time /= 60;                  // общее количество минут
		if(time > results.minute){
			results.minute = time;
			minute = time%60;
			time -= minute

			time /= 60;               // общее количество часов
			if(time > results.hour){
				results.hour = time;
				hour = time;
				// остановка секутдомера
				if(hour > 999){
					hour = 999;
					minute = 59;
					second = 59;
					millisecond = 99;
					stopBtn();
				}
				// установка значения часов в тело документа
				field_hour.innerText = is_9(hour);
			}
			// установка значения минут в тело документа
			field_minute.innerText = is_9(minute);
		}
		// установка значения секунд в тело документа
		field_second.innerText = is_9(second);
	}
	// установка значения миллисекунд в тело документа
	field_millisecond.innerText = is_9(millisecond);
}


function startBtn(){
	if(startLog == 0){
		results.start = Date.now();  // начало отсчета времени
		results.pauseTime = 0;       // обнуление времени всех пауз
		results.second = 0;          // обнуление секунд
		results.minute = 0;          // обнуление минут
		results.hour = 0;            // обнуление часов

		startLog = 1;
		result_index = 1;
		hour = 0;
		minute = 0;
		second = 0;
		millisecond = 0;

		// сброс показаний секундомера
		field_hour.textContent = '00';
		field_minute.textContent = '00';
		field_second.textContent = '00';
		field_millisecond.textContent = '00';

		// обнуление таблицы результатов
		result_table.innerHTML = '';

		// стилизация кнопок запущенного секундомера
		btnStart.classList.remove('btn');
		btnPause.classList.add('btn');
		btnStop.classList.add('btn');
		btnCount.classList.add('btn');

		// очистка и установка интервала
		clearInterval(interval);
		interval = setInterval(startTimer, 10);
	}
}


function pauseBtn(){
	if(startLog == 1){
		btnCount.classList.remove('btn');
		if(pauseLog==0){
			results.startPause = Date.now();
			clearInterval(interval);
			pauseLog = 1;
		}
		else{
			results.pauseTime += Date.now() - results.startPause;
			interval = setInterval(startTimer, 10);
			btnCount.classList.add('btn');
			pauseLog = 0;
		}
	}
}


function stopBtn(){
	if(startLog==1){
		stopLog = 1;
		startLog = 0;
		pauseLog = 0;

		if(result_index<=resultLimit){
			addResult();
		}

		stopLog = 0;

		// стилизация кнопок при выключении
		btnStart.classList.add('btn');
		btnPause.classList.remove('btn');
		btnStop.classList.remove('btn');
		btnCount.classList.remove('btn');
		clearInterval(interval);
	}
}


btnStart.addEventListener('click', startBtn);
btnPause.addEventListener('click', pauseBtn);
btnStop.addEventListener('click', stopBtn);
btnCount.addEventListener('click', addResult);




// добавление значений измерений в таблицу #time_items
const result_table = document.querySelector('#time_items');
const first_result = {};
const now_result = {};
const previous_result = {};
let result_index = 1;  // startBtn(); addResult();



// запись показаний времени в объект
function writeResult(object){
	object.hour=hour;
	object.minute=minute;
	object.second=second;
	object.millisecond=millisecond;
}



// основная функция добавления результата в таблицу
function addResult() {
	// проверка запуска таймера или паузы
	if(((pauseLog==0)&(startLog==1))||(stopLog==1)){

		// если первый цикл
		if(result_index==1){
			// записываем текущее время в объект
			writeResult(first_result);
			writeResult(previous_result);
		}

		// записываем текущее время в объект
		writeResult(now_result);

		// создаём эдемент <tr>
		let tableTr = document.createElement("tr");

		// вычисляем строку для заполнения элемента <tr>
		// и вставляем внутрь <tr> код с <td>...</td>
		tableTr.innerHTML = createTdElement();

		// добавляем потомка к result_table
		// вставляем новый тег <tr></tr> в тело документа в #time_items
		result_table.append(tableTr);

		// индекс следующего значения
		result_index++;

		// проверка лимита значений в таблице
		if(result_index <= resultLimit){
			// инфо для следующего цикла
			writeResult(previous_result);
		} else {
			stopBtn(); // остановка секундомера
		}

		// прокручиваем страницу до элемента селектора .scrollToMe
		scroll('smooth');
	}
}



// вычисляем строку для заполнения элемента <tr></tr>
// собираем код с <td>...</td>
function createTdElement(){
	let hh, mm, ss, mss;
	let td = '<td>' + result_index + '</td><td>';

	// поправка для вычислений при отрицательных значений
	function time_mod() {
		if(mss < 0){ ss--; mss+=100; }
		if(ss < 0) { mm--; ss+=60;	}
		if(mm < 0) { hh--; mm+=60;	}
	}

	// текущее время
	td += is_9(hour) + ':' + is_9(minute) + ':' + is_9(second) + ':' + is_9(millisecond) + '</td><td>';

	// расчет времени относительно первого значения
	mss = now_result.millisecond - first_result.millisecond;
	ss = now_result.second - first_result.second;
	mm = now_result.minute - first_result.minute;
	hh = now_result.hour - first_result.hour;
	time_mod();
	td += is_9(hh) + ':' + is_9(mm) + ':' + is_9(ss) + ':' + is_9(mss) + '</td><td>';

	// расчет времени относительно предыдущего значения
	mss = now_result.millisecond - previous_result.millisecond;
	ss = now_result.second - previous_result.second;
	mm = now_result.minute - previous_result.minute;
	hh = now_result.hour - previous_result.hour;
	time_mod();
	td += is_9(hh) + ':' + is_9(mm) + ':' + is_9(ss) + ':' + is_9(mss) + '</td>';

	return td;
}




// Функция будет прокручивать страницу до селектора .scrollToMe
// При добавлении нового элемента - вызываем функцию scroll('smooth');
function scroll(bbb) {
	var scrollInfo = document.querySelector('.scrollToMe');
	if (!scrollInfo) return ;

	scrollInfo.scrollIntoView({
		behavior: bbb || 'auto',
		block: 'end',
	});
}
