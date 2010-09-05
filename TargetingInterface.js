function TargetingInterface()
{
}

TargetingInterface.prototype =
{  
   // cursor position
   y : null,
   x : null,

   // item to be thrown
   item : null,

   // flag sets to true when the interface is in use
   on : false,

   /**
    * Open The targeting interface. The game is paused while the user
    * moves a target within a limited area and choose where to throw the item
    * given in parameter.
    *
    * @requires item to be a valid item
    */
   open : function(item, maxDistance, minDistance)
   {
      this.on = true;

      this.item = item;

      g_player.updateReachableTiles(maxDistance, minDistance);

      // if no minimum range is specified, center the target on the player's position 
      if(!minDistance)
      {
         this.x  = g_player.x;
         this.y = g_player.y;
      }
      // else choose a random starting tile
      else
      {
         var tile = g_player.reachableTiles[Math.floor(Math.random() * g_player.reachableTiles.length)];

         this.x = tile.x;
         this.y = tile.y;
      }

      // draw the reachable area and the target
      g_level.draw();
    
      // key handling
      setKeyHandler(function(event)
      {
         var yNew = g_targetingInterface.y;
         var xNew = g_targetingInterface.x;
        
         switch(event.keyCode)
         {
            //ESCAPE
            case 27:
               g_targetingInterface.close();
               return;
            // ENTER
            case 13:
               setKeyHandler(g_gameObjectManager.keyHandler_inactive);
 
               g_targetingInterface.on = false;
               g_level.draw();
               
               var callback = function()
               {
                  // drop the thrown item
                  g_targetingInterface.item.drop(g_targetingInterface.x, g_targetingInterface.y);
                  
                  // if necessary, execute an item-specific action
                  if(g_targetingInterface.item.afterThrow)
                     g_targetingInterface.item.afterThrow();

                  g_level.draw();
                  g_menu.backToGame();
               };

               new ThrowAnimation(callback, g_player.x, g_player.y, g_targetingInterface.x, g_targetingInterface.y).start();
               return;
            // left arrow
            case 37:
            // numpad 4
            case 100:
               xNew = g_targetingInterface.x - 1;
               break;
            // up arrow
            case 38:
            // numpad 8
            case 104:
               yNew = g_targetingInterface.y - 1;
               break;
            // right arrow
            case 39:
            // numpad 6
            case 102:
               xNew = g_targetingInterface.x + 1;
               break;
            // down arrow
            case 40:
            // numpad 2
            case 98:
               yNew = g_targetingInterface.y + 1;
               break;

            // diagonals
            // numpad 1
            case 97:
               xNew = g_targetingInterface.x - 1; 
               yNew = g_targetingInterface.y + 1; 
               break;
            // numpad 3
            case 99:
               xNew = g_targetingInterface.x + 1; 
               yNew = g_targetingInterface.y + 1; 
               break;
            // numpad 7
            case 103:
               xNew = g_targetingInterface.x - 1; 
               yNew = g_targetingInterface.y - 1; 
               break;
            // numpad 9
            case 105:
               xNew = g_targetingInterface.x + 1; 
               yNew = g_targetingInterface.y - 1; 
               break;
         }

         // if the tile is reachable, we can move the target here
         var tile = g_level.getTile(xNew, yNew);
         if((yNew != g_targetingInterface.y || xNew != g_targetingInterface.x) && tile && g_player.reachableTiles.containsObject(tile))
         {
            g_targetingInterface.y = yNew;
            g_targetingInterface.x = xNew;

            // redraw the reachable area and the target
            g_level.draw();
         }
      });
   },

   /**
    * Close the targeting interface and return to the game.
    */
   close : function()
   {
      this.on = false;

      // redraw the level to get rid of the reachable area highlighting
      g_level.draw();

      g_menu.backToGame();
   }
};
