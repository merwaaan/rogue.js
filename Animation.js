function Animation(callback)
{
   this.callback = callback;
}

Animation.prototype =
{
   // function to be called when the animation is over
   callback : null,

   // methods
   start : null,

   step : null,

   end : function()
   {
      if(this.callback)
         this.callback();
   }
};

// THROW ANIMATION

function ThrowAnimation(callback, x1, y1, x2, y2)
{
   Animation.call(this, callback);

   // get an array containing a list of points from the player to the target
   // and convert them to canvas coordinates
   this.trajectory = bresenhamLinePoints(x1, y1, x2, y2);
   for(var i = 0; i < this.trajectory.length; i++)
      this.trajectory[i] = levelToCanvasCoord(this.trajectory[i][0], this.trajectory[i][1] + 1);

   // configure the graphic context
   getCanvasContext().fillStyle = 'white';
}

ThrowAnimation.prototype =
{
   trajectory : null,
   
   start : function()
   {
      g_currentAnimation = this;

      setTimeout(this.step, THROW_ANIM_FREQ);
   },

   step : function()
   {
      // draw the first point of the trajectory and then remove it from the array
      getCanvasContext().fillText(THROW_ANIM_CHAR, g_currentAnimation.trajectory[0][0], g_currentAnimation.trajectory[0][1]);
      g_currentAnimation.trajectory.shift();

      // if there is no more points to draw, stop the animation
      if(g_currentAnimation.trajectory.length == 0)
         g_currentAnimation.end();
      else
         setTimeout(g_currentAnimation.step, THROW_ANIM_FREQ);
   }
};

extend(ThrowAnimation, Animation);
