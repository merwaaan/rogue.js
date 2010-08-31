function TargetingInterface()
{
}

TargetingInterface.prototype =
{  
   // target position
   row : null,
   column : null,

   // item to be thrown
   item : null,

   // flag set to true when the interface is is use
   on : false,

   /**
    * Reset the targeting interface by centering the target on the player's 
    * position and updating the tiles reachable by the player.
    */
   reset : function(creature)
   {
      this.row = g_player.y;
      this.column  = g_player.x;

      g_player.updateReachableTiles();
   },

   /**
    * Open The targeting interface. The game is paused while the user
    * moves a target on the level and choose where to throw the item
    * given in parameter.
    *
    * @requires item to be a valid item
    */
   open : function(item)
   {
      this.item = item;

      this.reset();
      this.on = true;

      // draw the reachable area and the target
      g_level.draw(g_gameObjectManager.xOffset, g_gameObjectManager.yOffset);
    
      // key handling
      targetingInterface = this;
      setKeyHandler(function(event)
      {
         var newRow = targetingInterface.row;
         var newColumn = targetingInterface.column;
        
         switch(event.keyCode)
         {
            //ESCAPE
            case 27:
               targetingInterface.close();
               return;
            // ENTER
            case 13:
               // throw the item to the targeted position
               targetingInterface.throwItem();
               targetingInterface.close();
               return;
            // left arrow
            case 37:
               newColumn = targetingInterface.column - 1;
               break;
            // up arrow
            case 38:
               newRow = targetingInterface.row - 1;
               break;
            // right arrow
            case 39:
               newColumn = targetingInterface.column + 1;
               break;
            // down arrow
            case 40:
               newRow = targetingInterface.row + 1;
               break;
         }

         // if the tile is reachable, we can move the target here
         var tile = g_level.getTile(newColumn, newRow);
         if((newRow != targetingInterface.row || newColumn != targetingInterface.column) && tile && g_player.reachableTiles.containsObject(tile))
         {
            targetingInterface.row = newRow;
            targetingInterface.column = newColumn;

            // redraw the reachable area and the target
            g_level.draw(g_gameObjectManager.xOffset, g_gameObjectManager.yOffset);
         }
      });
   },

   /**
    * Close the targeting interface and return to the game.
    */
   close : function()
   {
      targetingInterface.on = false;
      g_menu.backToGame();

      // redraw the level to get rid of the reachable area
      g_level.draw(g_gameObjectManager.xOffset, g_gameObjectManager.yOffset);
   },

   /**
    *
    */
   throwItem : function()
   {
      this.item.drop(this.column, this.row);
   }
};

