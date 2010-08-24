function Item(x, y, type, owner)
{
    VisualGameObject.call(this, x, y, type);

    this.owner = owner;
}

Item.prototype =
{                               
   // item owner
   owner : null,

   destroyItem : function()
   {
      this.destroyVisualGameObject();
   },

   pickUp : function(creature)
   {
      if(creature.inventory.hasFreeSlot(this))
      {
         this.owner = creature;

         // only works for @ at the moment
         creature.inventory.add(this.getCategory(), this);

         if(creature.type == 'PLAYER')
         {
            writeMessage(g_player.getName() + ' pick up a ' + this.getName(), 'INFO');
         }

         g_level.getTile(this.x, this.y).pickUpItem(this);
      }
      else
      {
         writeMessage('There is not enough space in your inventory');
      }
   },

   drop : function(x, y)
   {
      this.x = x;
      this.y = y;

      // unwield the item if currenctly used
      if(this.owner.weapon == this)
      {
         this.owner.weapon = null;
         updateWEAPON();
      }
      else if(this.owner.armor == this)
      {
         this.owner.armor = null;
         updateARMOR();
      }

      writeMessage(g_player.getName() + ' drop a ' + this.getName(), 'INFO');

      this.owner = null;
      g_level.getTile(x, y).dropItem(this);
   },

   /**
    * returns a string representing the name of the category that
    * the current item belongs to. This information comes from g_itemsCategories.
    *
    */
   getCategory : function()
   {
      for(var i = 0; i < g_itemsCategories.length; i++)
      {
         if(g_itemsCategories[i][0][this.type])
         {
            return g_itemsCategories[i][1];
         }
      }
   }
};

extend(Item, VisualGameObject);
