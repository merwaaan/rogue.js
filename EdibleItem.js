function EdibleItem()
{
	this.initEdibleItem = function(x, y, type, owner)
	{
		this.initItem(x, y, type, owner);

		return this;
	};

	this.destroyEdibleItem = function()
	{
		this.destroyItem();
	};

	this.consume = function()
	{
		
	};
}

EdibleItem.prototype = new Item;
