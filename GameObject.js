function GameObject(x, y, type)
{
   this.type = type;

   if(x != null && y != null)
   {
     this.move(x, y);
   }
   
   g_gameObjectManager.addGameObject(this);
}

GameObject.prototype =
{
    type : null,

    // data from the dictionnary
    info : null,

    // position 
    x : null,
    y : null,

    destroyGameObject : function()
    {
        g_gameObjectManager.removeGameObject(this);
    },

   move : function(x, y)
   {
      // free the previous position
      if(this.x != null && this.y != null)
      {
         g_level.getTile(this.x, this.y).creature = null;
      }

      this.x = x;
      this.y = y;
      
      g_level.getTile(x, y).creature = this;
   },

   /**
    * @requires obj to be a GameObject
    * @returns true if the the current object is in an adjacent tile of obj
    */
   nextTo : function(obj)
   {
      return Math.abs(this.x - obj.x) <= 1 && Math.abs(this.y - obj.y) <= 1;
   },

   getName : function()
   {
      return this.info['name'] ? this.info['name'] : 'no name in the dictionnary';
   },

   getDescription : function()
   {
      return this.info['desc'] ? this.info['desc'] : 'no description in the dictionnary';
   }
};
