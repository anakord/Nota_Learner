/* Класс: Nota
		Описывает ноту, объединяя ее обозначение, отрисовку
	и воспроизведение в общую сущность

		name - закодированное название ноты (2-3 знака), где
			name[0] - обозначение ноты по-латински
			name[1] - прибавление полтона (необязательно)
			name[2] - 1 или 2 октава
		pos - позиция на нотном стане по высоте (относительная)
		view - связывает каждую ноту с граф. отображением в css

		_is_alternota() - возвращает, имеется ли альтерация

		drawNota() - отрисовка ноты на нотном стане
		makeCorrect() - навешивание события на соответсвующую клавишу
		makeUnCorrect() - снятие события с клавиши
		playMusic() - аудиопроигрывание ноты

*/

class Nota {

	last_audio; // Последняя проигранная запись

	constructor(name, pos){
		this.name =  name;
		this.pos =  pos;
		this.view = new Object();
		this.view = document.getElementById(name);
		this.view.addEventListener('click', function (){
			this.view.classList.add('active');
			this.playMusic();
  	}.bind(this))
  	this.view.addEventListener('animationend', function (){
			this.classList.remove('active');
			this.classList.remove('right');
  	})

		this.audio = new Audio();
		this.audio.src = "src/music/" + this.name + ".mp3";
	}
	get name() { return this._name; }
	set name(value) { this._name = value; }
  get pos() { return this._pos;  }
  set pos(value) { this._pos = value; }

	makeCorrect(){
		this.view.classList.add('right'); //Выделение зеленым
		this.view.onclick = function right_choose(){
			this.onclick = 'undefined';
			this.classList.add('right'); //Выделение зеленым
			next_nota();
		}
	};

	makeUnCorrect(){
		this.view.onclick = 'undefined';
		this.view.classList.remove('right');
  };

	_is_middleBase() { // Нужна ли вспомогательная линия по-середине
		return  (['C1', 'Cd1', 'A2', 'Ad2'].includes(this.name));
	}

	_is_bottomBase(){
		return this.name == 'B2';
	}

	_is_alternota(){
			return this.name[1] == 'd';
	}

	drawNota(drawer){
		let is_bimol = false;
		let is_alternota = this._is_alternota();
		if(is_alternota)
			is_bimol = (Math.random() >= 0.5);

		drawer.Draw_Nota(this.pos,
			this._is_middleBase(), this._is_bottomBase(),
			is_alternota, is_bimol);
	};

	playMusic(){
		if(typeof(this.last_audio) != 'undefined')
			this.last_audio.stop();
		this.last_audio = this.audio;
		this.audio.play();
	};
}

/* Класс: Notes
		Описывает всю совокупность нот, перестраивает ноты в зависимости
		от ключа.

		arr_Nota - массив нот, при инициализации заполняется по
			скрипичному ключу

		GetPosByName(name) - возвращает позицию ноты по ее названию
		GetRandomNota() - возвращает случайную ноту, отличающуюся от пред.
		clear_correct() - стирает все события со всех клавиш
*/
class Notes {
	arr_Nota = [];
	last_rnd_pos;

	constructor(){
		this.arr_Nota.push(new Nota('C1', 1))
		this.arr_Nota.push(new Nota('Cd1', 1))
		this.arr_Nota.push(new Nota('D1', 2))
		this.arr_Nota.push(new Nota('Dd1', 2))
		this.arr_Nota.push(new Nota('E1', 3))
		this.arr_Nota.push(new Nota('F1', 4))
		this.arr_Nota.push(new Nota('Fd1', 4))
		this.arr_Nota.push(new Nota('G1', 5))
		this.arr_Nota.push(new Nota('Gd1', 5))
		this.arr_Nota.push(new Nota('A1', 6))
		this.arr_Nota.push(new Nota('Ad1', 6))
		this.arr_Nota.push(new Nota('B1', 7))
		this.arr_Nota.push(new Nota('C2', 8))
		this.arr_Nota.push(new Nota('Cd2', 8))
		this.arr_Nota.push(new Nota('D2', 9))
		this.arr_Nota.push(new Nota('Dd2', 9))
		this.arr_Nota.push(new Nota('E2', 10))
		this.arr_Nota.push(new Nota('F2', 11))
		this.arr_Nota.push(new Nota('Fd2', 11))
		this.arr_Nota.push(new Nota('G2', 12))
		this.arr_Nota.push(new Nota('Gd2', 12))
		this.arr_Nota.push(new Nota('A2', 13))
		this.arr_Nota.push(new Nota('Ad2', 13))
		this.arr_Nota.push(new Nota('B2', 14))
	}

	getPosByName(name){
		try {
			let result =
				this.arr_Nota.find(curnota => curnota.name===name).pos;
			return result;
		} catch(e){
			alert("Попытка обращения к несуществующей ноте");
		}
	}

	getRandomNota(){
		let rnd_pos;
		do {
			rnd_pos =
				Math.floor(Math.random() * Math.floor(this.arr_Nota.length));
		} while (rnd_pos == this.last_rnd_pos);
		this.last_rnd_pos = rnd_pos;
		return this.arr_Nota[rnd_pos];
	}

	clear_correct(){
		this.arr_Nota.forEach(function(curnota){
			curnota.makeUnCorrect();
		})
	}
}
