function GameObjectManager()
{
	g_gameObjectManager = this;

	this.gameObjects = new Array();

	this.applicationManager = new ApplicationManager();

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
}

GameObjectManager.prototype =
{
	gameObjects : null,

	applicationManager : null,

	turn : 0,

	xOffset : 0,
	yOffset : 0,
	
	step : function()
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
	},

	addGameObject : function(object)
	{
		this.gameObjects.push(object);
	},

	removeGameObject : function(object)
	{
		this.gameObjects.removeObject(object);
	},

	keyDown : function(event)
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
