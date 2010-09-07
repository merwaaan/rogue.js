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
      this.owner = creature;

      // only works for @ at the moment
      creature.inventory.push(this);

      if(creature.type == 'PLAYER')
         writeMessage(g_player.getName() + ' pick up a ' + this.getName(), 'INFO');

      g_level.getTile(this.x, this.y).pickUpItem(this);

   },

   /**
    * Drop the item on the tile the owner is standing on. Any owner/item
    * relation will be erased and the item will be given independant level coordinates.
    */
   drop : function(x, y)
   {
      // handle the item/owner relation
      if(this.owner)
      {
         // unwield the item before removing it from the owner's inventory
         if(this.owner.left == this)
            this.owner.left = null;
         else if(this.owner.right == this)
            this.owner.right = null;
     
         // remove from the owner's inventory and erase the owner
         this.owner.inventory.removeObject(this);
         this.owner = null; 
      }

      // put the item on the tile
      g_level.getTile(x, y).dropItem(this);
      
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
   },

   /**
    * Display a targeting interface which lets the user choose a target and
    * drop it on the selected tile once the animation is over.
    */
   aimAndThrow : function()
   {
      var item = this;

      // function which will be called once a target has been selected
      var callback_afterTargeting = function()
      {
         // function which will be called once the throw animation is over
         var callback_afterAnimation = function()
         {
            // drop the item on the targeted tile
            item.drop(g_targetingInterface.x, g_targetingInterface.y);

            // if the item is supposed to execute a certain action after having been thrown...
            if(item.afterThrow)
               item.afterThrow();

            // redraw the level and the status menu
            g_level.draw();
            g_menu.backToGame();

            // reactivate user inputs
            setKeyHandler(g_gameObjectManager.keyHandler_game);
         };

         // block user inputs
         setKeyHandler(g_gameObjectManager.keyHandler_inactive);

         // start a throw animation from the player to the targeted tile
         new ThrowAnimation(g_player.x, g_player.y, g_targetingInterface.x, g_targetingInterface.y, callback_afterAnimation).start();
      };

      // if the item is throw by a weapon, we use the launcher min and max range
      var minRange = item.weapon && item.weapon.minRange ? item.weapon.minRange : 0;
      var maxRange = item.weapon && item.weapon.maxRange ? item.weapon.maxRange : THROW_RADIUS;

      // open the targeting interface
      g_targetingInterface.open(maxRange, minRange, callback_afterTargeting);
   }
};

extend(Item, VisualGameObject);
