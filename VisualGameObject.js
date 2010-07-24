function VisualGameObject(x, y, type)
{
    GameObject.apply(this, [x, y, type]);
}       

VisualGameObject.prototype =
{
    destroyVisualGameObject : function()
    {
        this.destroyGameObject();
    },

    model : function()
    {
        return [this.info['char'], this.info['color']];
    }
};

extend(VisualGameObject, GameObject);
