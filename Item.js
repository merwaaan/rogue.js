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

   /**
    * Drop the item on the tile the owner is standing on. All the owner/item
    * relation will be erased and the item will be given independant level coordinates.
    *
    * @requires the item to be in a creature's inventory
    */
   drop : function(x, y)
   {
      // unwield the item before removing it from the owner's inventory
      if(this.owner.left == this)
         this.owner.left = null;
      else if(this.owner.right == this)
         this.owner.right = null;

      writeMessage((this.owner == g_player ? '' : 'The ') + this.owner.getName() + ' drop a ' + this.getName(), 'INFO');
     
      // put the item on the tile
      g_level.getTile(this.owner.x, this.owner.y).dropItem(this);
      
      // remove from the owner's inventory and erase the owner
      this.owner.inventory.remove(this);
      this.owner = null; 

      // update the status menu, in case the dropped item was wielded
      g_menu.updateStatusMenu();
   },

   /**
    * Equip the owner with this item, it will be placed in the left hand if the string
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
      // check if there is an owner or if the item is just laying somewhere
      if(!this.owner)
         return false;

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
