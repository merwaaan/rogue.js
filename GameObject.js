function GameObject()
{
	this.type = null;

	// position	
	this.x = null;
	this.y = null;

	this.initGameObject = function(x, y, type)
	{
		this.type = type;

		this.move(x, y);

		g_gameObjectManager.addGameObject(this);

		return this;
	};

	this.destroyGameObject = function()
	{
		g_gameObjectManager.removeGameObject(this);
	};

	this.move = function(x, y)
	{
		// free the previous position
		if(this.x != null && this.y != null)
		{
			g_level.getTile(this.x, this.y).creature = null;
		}

		this.x = x;
		this.y = y;

		// occupy the new position
		g_level.getTile(x, y).creature = this;
	};
}
