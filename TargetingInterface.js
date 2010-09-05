function TargetingInterface()
{
}

TargetingInterface.prototype =
{  
   // target position
   y : null,
   x : null,

   // item to be thrown
   item : null,

   // flag sets to true when the interface is in use
   on : false,

   // array containing the list of points used for the animation
   trajectory : null,

   /**
    * Reset the targeting interface by centering the target on the player's 
    * position and updating the tiles reachable by the player.
    */
   reset : function(creature)
   {
      this.y = g_player.y;
      this.x  = g_player.x;

      g_player.updateReachableTiles();
   },

   /**
    * Open The targeting interface. The game is paused while the user
    * moves a target within a limited area and choose where to throw the item
    * given in parameter.
    *
    * @requires item to be a valid item
    */
   open : function(item)
   {
      this.item = item;
      this.on = true;

      this.reset();

      // draw the reachable area and the target
      g_level.draw();
    
      // key handling
      targetingInterface = this;
      setKeyHandler(function(event)
      {
         var yNew = targetingInterface.y;
         var xNew = targetingInterface.x;
        
         switch(event.keyCode)
         {
            //ESCAPE
            case 27:
               targetingInterface.close();
               return;
            // ENTER
            case 13:
               // throw the item to the targeted position
               targetingInterface.startThrowAnimation();
               return;
            // left arrow
            case 37:
               xNew = targetingInterface.x - 1;
               break;
            // up arrow
            case 38:
               yNew = targetingInterface.y - 1;
               break;
            // right arrow
            case 39:
               xNew = targetingInterface.x + 1;
               break;
            // down arrow
            case 40:
               yNew = targetingInterface.y + 1;
               break;
         }

         // if the tile is reachable, we can move the target here
         var tile = g_level.getTile(xNew, yNew);
         if((yNew != targetingInterface.y || xNew != targetingInterface.x) && tile && g_player.reachableTiles.containsObject(tile))
         {
            targetingInterface.y = yNew;
            targetingInterface.x = xNew;

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

      g_menu.backToGame();

      // redraw the level to get rid of the reachable area highlighting
      g_level.draw();
   },

   /**
    * Start an animation representing the throw of an item from
    * the player position to the target position. It is not a
    * real-time animation as the flow of the game is paused during
    * its execution.
    */
   startThrowAnimation : function()
   {
      // get an array containing a list of points from the player to the target
      this.trajectory = bresenhamLinePoints(g_player.x, g_player.y, this.x, this.y);

      // convert from level coordinates to canvas coordinates
      for(var i = 0; i < this.trajectory.length; i++)
         this.trajectory[i] = levelToCanvasCoord(this.trajectory[i][0], this.trajectory[i][1] + 1);

      // draw the screen in order to get rid of the reachable zone highlight
      this.on = false;
      g_level.draw();

      // start the animation
      setTimeout(this.playThrowAnimation, THROW_ANIM_FREQ);
   },

   /**
    * Draw a new point along the trajectory each THROW_ANIM_FREQ seconds.
    * When the animation is over, the item is dropped, the targeting interface 
    * is closed and the game is resumed.
    *
    * As the method is asynchronously called, it is necessary to refer to the
    * targeting interface by the global reference g_targetingInterface and not
    * the 'this' keyword.
    */
   playThrowAnimation : function()
   {
      // draw the first point of the trajectory array
      var ctx = getCanvasContext();
      ctx.strokeStyle = 'green';
      ctx.fillText(THROW_ANIM_CHAR, g_targetingInterface.trajectory[0][0], g_targetingInterface.trajectory[0][1]);
         
      // remove the drawn pointa from the trajectory array
      g_targetingInterface.trajectory.shift();

      // if there is no more points to draw, stop the animation, drop the item and go back to the game
      if(g_targetingInterface.trajectory.length == 0)
      {      
         g_targetingInterface.item.drop(g_targetingInterface.x, g_targetingInterface.y);

         // execute an item-specific action, if necessary
         if(g_targetingInterface.item.afterThrow)
            g_targetingInterface.item.afterThrow();

         g_targetingInterface.close();
      }
      else
         setTimeout(g_targetingInterface.playThrowAnimation, THROW_ANIM_FREQ);
   }
};

