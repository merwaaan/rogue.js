function AStar()
{
}

AStar.prototype =
{
    open : null,
    closed : null,

    // return an array of Tiles leading to tile tileEnd from tile tileStart
    getPath : function(tileStart, tileEnd, diagonal)
    {
        this.open = new Array();
        this.closed = new Array();

        // put the starting tile in the open list
        var current = tileStart;
        this.open.push(current);

        while(this.open.length > 0)
        {
            // transfer the best tile from the open list to the closed list
            current = this.getBestTile(this.open);
            this.open.removeObject(current);
            this.closed.push(current);

            // stop the search if we reach the target tile
            if(current.equals(tileEnd))
            {
                break;
            }

            // for all the current tile neighbors...
            for(var y = -1; y < 2; y++)
            {
                for(var x = -1; x < 2; x++)
                {
                    if((x != 0 || y != 0) && (diagonal ? true : x == 0 || y == 0))
                    {
                        var neighbor = g_level.getTile(current.x + x, current.y + y);

                        // if the neighbor exists, is walkable and is not in the closed list
                        if(neighbor != undefined && neighbor.isWalkable() && !this.closed.containsObject(neighbor))
                        {
                            // if the neighbor is not already present in the open list, add it
                            if(!this.open.containsObject(neighbor))
                            {
                                // calculate the neighbor score
                                neighbor.parent = current;
                                neighbor.c = this.getCost(current, neighbor);
                                neighbor.m = this.getManhattan(neighbor, tileEnd);

                                this.open.push(neighbor);
                            }
                            // if the neighbor is already in the open list, check if
                            else
                            {
                                if(this.getCost(current, neighbor) < neighbor.c)
                                {
                                    neighbor.parent = current;
                                    neighbor.c = this.getCost(current, neighbor);
                                }               
                            }
                        }
                    }
                }
            }
        }
        
        // return null if there is no existing path between the two tiles
        if(this.open.length == 0)
        {
            return null;
        }

        var tile = tileEnd;
        var path = new Array();

        // start from the target tile and go up following the parent tiles until we reach the starting tile
        do
        {
            path.push(tile);
            tile = tile.parent;
        } while(!tile.equals(tileStart));
        
        path.push(tileStart);

        path = path.reverse();

        return path;
    },

    getBestTile : function(list)
    {
        var iBest = 0;

        for(var i = 0; i < list.length; i++)
        {
            if(list[i].c + list[i].m < list[iBest].c + list[iBest].m)
            {
                iBest = i;
            }
        }

        return list[iBest];
    },

    getCost : function(tileFrom, tileTo)
    {
        return tileFrom.c + (tileFrom.x == tileTo.x || tileFrom.y == tileTo.y ? 10 : 14);
    },

    getManhattan : function(tile1, tile2)
    {
        return (Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y)) * 10;
    },
}
