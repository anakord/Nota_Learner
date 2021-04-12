/* Класс: Drawer
		Содержит методы отрисовки нотного стана

		cnv - канвас, взятый с html страницы для отображения нотного стана
    ctx - 2d контекст для отрисовки на этом канвасе
    nota_width - округленное значение ширины отрисованной ноты
    dy - интервал между нотными линиями
    x_line - позиция ноты по горизонтали

		pos - позиция на нотном стане по высоте (относительная)
		view - связывает каждую ноту с граф. отображением в css

    _Draw_Line(y) - отрисовка нотной линии по высоте y
    _Draw_Clef(img_treble) - отрисовка ключа (default: скрипичный)
    _Draw_AlterationNota(img_alternota) - отрисовка диеза/бимоля
    _get_Nota_pos(y_line) - вычисляет значения позиции ноты
      возврашает {позиция_X, позиция_Y}
    _Draw_BaseLine(x_pos, y_pos, is_under = false) - отрисовка вспомогательной линии
    (default по-середине)
     x_pos, y_pos - явная передача позиции
     is_under - начертить линию не по-середине, а снизу

		DrawNotaLines() - отрисовка нотных линий и ключа
    Draw_reset() - стирание нот и DrawNotaLines
    Draw_Nota(letter, y_line, is_bimol = false) - отрисовка ноты
      letter - буквенное обозначение для выяснения, нужны ли доплинии и альтерация
      (неправильно, зато легче в реализации)
      y_line - высота по y
      is_bimol - бимоль или диез при отрисовке
*/

class Drawer {
  constructor() {
    // Инициализация канваса отрисовки нотного стана
    this.cnv = document.getElementById("cnv_nota_panel");
    this.ctx = this.cnv.getContext('2d');

    this.nota_width =  Math.round(this.cnv.height);
    this.dy 				=  Math.round(this.cnv.height/8);
    this.x_line     =  1;
  }

  // Функция Draw_Line - отрисовывает линию на канвасе
  // y(int) - высота для линии
  _Draw_Line(y) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.cnv.width, y);
    this.ctx.stroke();
  }

  // Функция отрисовки ключа (выполняется при подгрузке изображения)
  _Draw_Clef(img_treble){
    this.ctx.drawImage(
      img_treble,
      this.cnv.width/25, this.dy/2,
      img_treble.width/img_treble.height*this.dy*7, this.dy*7);
  };

  // Функция отрисовки нотных линий
  Draw_NotaLines() {

  	this.ctx.lineWidth = 2;

    for (let y = 2*this.dy; y < this.nota_width-this.dy; y=y+this.dy)
      this._Draw_Line(y);

    let img_treble = new Image();
    img_treble.onload = this._Draw_Clef.bind(this, img_treble);
    img_treble.src = "src/pic/treble_clef.png";
  }

  // Функция отрисовки знака альтерации (выполняется при подгрузке изображения)
  // x_pos, y_pos - координаты ноты
  _Draw_AlterationNota(img_alternota, x_pos, y_pos) {
    this.ctx.drawImage(
      img_alternota,
      x_pos-this.dy, y_pos-this.dy/2-this.dy/8,
      img_alternota.width/img_alternota.height*this.dy, this.dy);
  };

  _get_Nota_pos(y_line){
    let x_pos = this.cnv.width/5+this.x_line*this.dy*1.8,
    y_pos =  Math.round(this.nota_width - (this.dy/2)* y_line - this.dy/2)+1;
    return { x_pos, y_pos };
  }

  _Draw_BaseLine(x_pos, y_pos, is_under = false){
    if(is_under) y_pos =  y_pos+this.dy/2;
    this.ctx.beginPath();
    this.ctx.moveTo(x_pos-this.dy/1.5, y_pos);
    this.ctx.lineTo(x_pos+this.dy/1.5, y_pos);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  Draw_Nota(y_line,
    is_middleBase = false, is_bottomBase = false,
    is_alternota = false, is_bimol = false) {

    // Если более 5 нот - обновление экрана
  	if(this.x_line > 6) this.Draw_reset();

  	if(is_bimol) y_line = y_line + 1; // Повышение ноты если бимоль

    let { x_pos, y_pos } = this._get_Nota_pos(y_line);

    // Отрисовка ноты стандарными средствами canvas
  	this.ctx.beginPath();
  	this.ctx.ellipse(x_pos, y_pos,
  							this.dy/2, this.dy/2, 0, 0, Math.PI*2);
  	this.ctx.fill();
  	this.ctx.closePath();

  	// Отрисовка добавочных линеек
  	if (is_middleBase)
      this._Draw_BaseLine(x_pos, y_pos);

  	if (is_bottomBase)
      this._Draw_BaseLine(x_pos, y_pos, true);



  	// Отрисовка диезов
  	if (is_alternota) {
      let img_alternota = new Image();
  		img_alternota.onload = this._Draw_AlterationNota.bind(this,
        img_alternota,
        x_pos, y_pos);
  		if(is_bimol) img_alternota.src = 'src/pic/bimol.png';
  			else  img_alternota.src = 'src/pic/diez.png';
  	}

  	this.x_line = this.x_line + 1;
  };

  Draw_reset(){
  	this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
  	this.Draw_NotaLines();
  	this.x_line = 1;
  }
}
