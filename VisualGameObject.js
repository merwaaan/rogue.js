function VisualGameObject()
{
	// ascii representation, precomputed to speed up the drawing process
	this.model = null;

	this.initVisualGameObject = function(x, y, type)
	{
		this.initGameObject(x, y, type);
	
		return this;
	};

	this.destroyVisualGameObject = function()
	{
		this.destroyGameObject();
	};
}

VisualGameObject.prototype = new GameObject;
