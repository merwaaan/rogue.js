function TargetingInterface()
{
}

TargetingInterface.prototype =
{  
   // cursor position
   y : null,
   x : null,

   // flag sets to true when the interface is in use
   draw : false,

   /**
    * Open The targeting interface which let the user manually choose a target.
    * The target can only be selected if it is within a radius of more than minDistance
    * and less than maxDistance. Once the user presses the ENTER key, the callback function
    * given in paramter is executed.
    *
    * @requires maxDistance to be a positive integer
    * @requires minDistance to be a positive integer or null
    * @requires callback to be a valid function
    */
   open : function(maxDistance, minDistance, callback)
   {
      // update the list of tiles reachable by a throw
      g_player.updateReachableTiles(maxDistance, minDistance);

      // center the target on the player's position
      this.x = g_player.x;
      this.y = g_player.y;

      // draw mode : on
      this.draw = true;
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
               if(g_targetingInterface.isTileReachable(g_level.getTile(g_targetingInterface.x, g_targetingInterface.y)))
               {
                  // redraw the level so that the highlited tiles disappear
                  g_targetingInterface.draw = false;
                  g_level.draw();
               
                  // execute the callback function
                  callback();

                  return;
               }
               break;
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

         var tile = g_level.getTile(xNew, yNew);
         if(tile)
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
      this.draw = false;
      g_level.draw();

      g_menu.backToGame();
   },

   /**
    * @returns true if tile is contained in the list of tiles reachable
    * by the player, false either.
    */
   isTileReachable : function(tile)
   {
      return g_player.reachableTiles.contains(tile);
   },

   /**
    * @returns true if tile is the tile currently targeted by the
    * targeting interface, false either.
    */
   isTileTarget : function(tile)
   {
      return tile == g_level.getTile(this.x, this.y);
   }
};
