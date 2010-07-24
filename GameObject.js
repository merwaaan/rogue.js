function GameObject(x, y, type)
{
    this.type = type;

    this.move(x, y);

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

        // occupy the new position
        g_level.getTile(x, y).creature = this;
    }
};
