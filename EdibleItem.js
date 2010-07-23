function EdibleItem()
{
	this.initEdibleItem = function(x, y, type, owner)
	{
		this.initItem(x, y, type, owner);

		this.info = g_edibleItemInfo[type];

		return this;
	};

	this.destroyEdibleItem = function()
	{
		this.destroyItem();
	};

	this.consume = function(creature)
	{
		writeMessage('You consume ' + this.info['name']);

		if(this.info['alteration'] == 'relative')
		{
			if(this.info['value'] > 0)
			{
				creature.getHealth(this.info['value']);
			}
			else if(this.info['value'] < 0)
			{
				creature.takeDamage(this.info['value']);
			}
		}
		else if(this.info['alteration'] == 'absolute')
		{
			// TODO
		}
		else if(this.info['alteration'] == 'progressive')
		{
			// TODO
		}
	};
}

EdibleItem.prototype = new Item;
