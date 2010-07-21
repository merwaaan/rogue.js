function GameObjectManager()
{
	this.gameObjects = null;

	this.applicationManager = null;

	this.turn = 0;

	this.xOffset = 0;
	this.yOffset = 0;

	this.initGameObjectManager = function()
	{
		g_gameObjectManager = this;

		this.gameObjects = new Array();

		this.applicationManager = new ApplicationManager().initApplicationManager();

		document.onkeydown = function(event)
		{
			clearMessages();

			g_gameObjectManager.keyDown(event);
			g_gameObjectManager.step();

			event.preventDefault();
		};

		this.buildTable(SIZE, SIZE);

		return this;
	};

	this.step = function()
	{
		// update
		for(i in this.gameObjects)
		{
			if(this.gameObjects[i].update)
			{
				this.gameObjects[i].update(this.table, this.xOffset, this.yOffset);
			}
		}

		// draw
		g_level.draw(this.xOffset, this.yOffset);
	};

	this.buildTable = function(width, height)
	{
		for(var y = 0; y < height; y++)
		{
 			$('#frame').append('<div></div>');
			
			for(var x = 0; x < width; x++)			
			{
				$('#frame div:last').append('<span class="tile" id="tile_' + y + '_' + x + '"></span>');					
			}
		}
	};

	this.addGameObject = function(object)
	{
		this.gameObjects.push(object);
	};

	this.removeGameObject = function(object)
	{
		this.gameObjects.removeObject(object);
	};

	this.keyDown = function(event)
	{
		for(i in this.gameObjects)
		{
			if(this.gameObjects[i].keyDown)
			{
				this.gameObjects[i].keyDown(event);
			}
		}
	}
}
