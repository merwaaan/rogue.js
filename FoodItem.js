function FoodItem(x, y, type, owner)
{
    Item.call(this, x, y, type, owner);

    this.info = g_foodInfo[type];
}

FoodItem.prototype =
{
    destroyFoodItem : function()
    {
        this.destroyItem();
    },

    consume : function(creature)
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
    }
};

extend(FoodItem, Item);
