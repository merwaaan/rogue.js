function ApplicationManager()
{
	g_level = new Level(50, 50);
	g_player = new Player();

	new Monster('SNAKE');
	new Monster('SNAKE');
	new Monster('SNAKE');
	new Monster('SNAKE');
	new Monster('SPIDER');
	new Monster('SPIDER');
	new Monster('SPIDER');
}

ApplicationManager.prototype =
{
};
