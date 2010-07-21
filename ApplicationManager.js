function ApplicationManager()
{
	this.initApplicationManager = function()
	{
		g_level = new Level().initLevel(50, 50);
	  g_player = new Player().initPlayer();

		new Monster().initMonster('SNAKE');

		return this;
	}
}
