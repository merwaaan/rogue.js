function Item()
{
	// item owner
	this.owner = null;

	this.initItem = function(x, y, type, owner)
	{
		this.initVisualGameObject(x, y, type);
	
		this.owner = owner;

		return this;
	};

	this.destroyItem = function()
	{
		this.destroyVisualGameObject();
	};

	this.pickUp = function(creature)
	{
		this.owner = creature;

		g_level.getTile(this.x, this.y).item = null;
	};

	this.drop = function(x, y)
	{
		this.owner = null;
		this.x = x;
		this.x = y;

		g_level.getTile(x, y).item = this;
	};
}

Item.prototype = new VisualGameObject;
