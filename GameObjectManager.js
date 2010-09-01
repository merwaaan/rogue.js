function GameObjectManager()
{
    g_gameObjectManager = this;

    this.gameObjects = new Array();

    this.applicationManager = new ApplicationManager();

    setKeyHandler(this.keyHandler_game);
}

GameObjectManager.prototype =
{
    gameObjects : null,

    applicationManager : null,

    turn : 0,

    xOffset : 0,
    yOffset : 0,
    
    step : function()
    {
        // update the game objects
        for(i in this.gameObjects)
            if(this.gameObjects[i].update)
                this.gameObjects[i].update(this.table, this.xOffset, this.yOffset);

        // draw
        g_level.draw(this.xOffset, this.yOffset);

        // update the turns count
        this.turns++;
    },

    addGameObject : function(object)
    {
        this.gameObjects.push(object);
    },

    removeGameObject : function(object)
    {
        this.gameObjects.removeObject(object);
    },

    keyDown : function(event)
    {
        for(i in this.gameObjects)
        {
            if(this.gameObjects[i].keyDown)
            {
               this.gameObjects[i].keyDown(event);
            }
        }
    },
    
   keyHandler_game : function(event)
   {
       clearMessages();

       g_gameObjectManager.keyDown(event);

       event.preventDefault();
   }
}
