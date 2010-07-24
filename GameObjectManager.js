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

            var keyHandler = function(event)
		{
			clearMessages();

			g_gameObjectManager.keyDown(event);
			g_gameObjectManager.step();

			event.preventDefault();
		};

            // Browsers have different behaviors regarding repeating
            // keys and special keys like arrows. Short version,
            // Chrome repeat the keyDown event for repeating arrow
            // keys, while FF repeat the keyPress event.
            // Long version : http://unixpapa.com/js/key.html
            if ($.browser.webkit)
                document.onkeydown = keyHandler;
            else
                document.onkeypress = keyHandler;

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
