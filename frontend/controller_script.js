this.arr_N = new Notes();
this.drawer_nota = new Drawer();

// next_nota(is_Restart: boolean)
function next_nota(){
	cur_nota = arr_N.getRandomNota();
	cur_nota.drawNota(drawer_nota);
	cur_nota.makeCorrect();
	return cur_nota;
};

// Запуск тренировки
// Обработка формы меню
let form = document.forms.f_menu;
form.b_start.addEventListener("click",
  function restart(){
		drawer_nota.Draw_reset(); // Очистка поля
		arr_N.clear_correct(); // Снятие всех событий
		next_nota();
  }
);
