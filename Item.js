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
      if(creature.inventory.enoughSpace(this))
      {
         this.owner = creature;

         // only works for @ at the moment
         creature.inventory.add(this);

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

      // unwield the item before removing it from the owner inventory
      if(this.owner.left == this)
      {
         this.owner.left = null;
         g_menu.updateStatusFrame();
      }
      else if(this.owner.right == this)
      {
         this.owner.right = null;
         g_menu.updateStatusFrame();
      }

      this.owner.inventory.remove(this);

      writeMessage(g_player.getName() + ' drop a ' + this.getName(), 'INFO');

      this.owner = null;
      g_level.getTile(x, y).dropItem(this);
   },

   /**
    * equip the owner with this item, it will be placed in the left hand if the string
    * 'left' is specified in parameter, if the string 'right' is specified it will be 
    * placed in the right hand
    */
   wield : function(hand)
   {
      if(hand == 'left')
         this.owner.left = this;
      else if(hand == 'right')
         this.owner.right = this;
   },

   /**
    * free the owner's hand holding the item
    *
    * @requires the item to be held
    */
   unwield : function()
   {
      if(this.owner.left == this)
         this.owner.left = null;
      else if(this.owner.right == this)
         this.owner.right = null;
   },

   /**
    * return true if the item is held in one of the player's hands, else false
    */
   isWielded : function(hand)
   {
      // without a parameter specified, return true if the item is in whatever hand
      if(!hand && (this.owner.left == this || this.owner.right == this))
         return true;

      // with a parameter specified, check the corresponding hand
      if(hand == 'left' && this.owner.left == this)
         return true;
      
      if(hand == 'right' && this.owner.right == this)
         return true;

      return false;
   }
};

extend(Item, VisualGameObject);
