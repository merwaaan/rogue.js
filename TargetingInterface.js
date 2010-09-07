function TargetingInterface()
{
}

TargetingInterface.prototype =
{  
   // cursor position
   y : null,
   x : null,

   // flags set to true when the cursor and/or the reachable area have to be drawn
   drawCursor : false,
   drawArea : false,

   /**
    * Open a targeting interface which lets the user manually choose a target.
    * The target can only be selected if it is within a radius of more than minDistance
    * and less than maxDistance. Once the user presses the ENTER key, the callback function
    * given in paramter is executed.
    *
    * @requires maxDistance to be a positive integer
    * @requires minDistance to be a positive integer or null
    * @requires callback to be a valid function
    */
   openFreeTargetingInterface : function(maxDistance, minDistance, callback)
   {
      // update the list of tiles reachable by a throw
      g_player.updateReachableTiles(maxDistance, minDistance);

      // center the target on the player's position
      this.moveCursor(g_player.x, g_player.y);

      // draw mode : on
      this.drawCursor = true;
      this.drawArea = true;
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
                  g_targetingInterface.drawCursor = false;
                  g_targetingInterface.drawArea = false;
                  g_level.draw();
               
                  // execute the callback function
                  callback();

                  g_targetingInterface.close();

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
            // move the cursor on the new position
            g_targetingInterface.moveCursor(xNew, yNew);

            g_level.draw();
         }
      });
   },

   /**
    * Open a targeting interface which lets the user choose a target amongst several.
    * The user can cycle through all the potential targets with SPACE.
    * Once the user presses the ENTER key, the callback function given in paramter is executed.
    *
    * @requires targets to be an array of GameObjects
    * @requires callback to be a valid function
    */
   openLimitedTargetingInterface : function(targets, callback)
   {
      // hold the index of the current target in the targets array
      var currentTargetIndex = 0;

      // center the cursor on the first target
      this.moveCursor(targets[0].x, targets[0].y);

      // draw the cursor
      this.drawCursor = true;
      g_level.draw();

      // key handling
      setKeyHandler(function(event)
      {
        switch(event.keyCode)
         {
            //ESCAPE
            case 27:
               g_targetingInterface.close();
               return;
            // SPACE
            case 32:
               // cycle through the different targets
               currentTargetIndex = currentTargetIndex < targets.length - 1 ? currentTargetIndex + 1 : 0;
               g_targetingInterface.moveCursor(targets[currentTargetIndex].x, targets[currentTargetIndex].y);
               
               // redraw
               g_level.draw();

               return;
            // ENTER
            case 13:
               // redraw the level so that the highlited tile disappear
               g_targetingInterface.drawCursor = false;
               g_level.draw();
               
               // execute the callback function
               callback();

               g_targetingInterface.close();

               return;
         }
      });
   },

   /**
    * Close the targeting interface and return to the game.
    */
   close : function()
   {
      this.drawCursor = false;
      this.drawArea = false;
      g_level.draw();

      g_menu.backToGame();
   },

   /**
    * Change the cursor's position.
    */
   moveCursor : function(x, y)
   {
      this.x = x;
      this.y = y;
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
