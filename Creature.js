function Creature(type)
{
    // search a FLOOR tile where the creature can be positionned
    var tile = g_level.getRandomTile('FLOOR');

    VisualGameObject.apply(this, [tile.x, tile.y, type]);

    this.HP = 15;
    this.maxHP = 15;

    this.weapon = g_weaponInfo['SWORD'];
    this.armor = g_armorInfo['SKIN'];
}

Creature.prototype =
{
    // status
    HP : null,
    maxHP : null,
    XP : null,

    // characteristics
    STR : null,
    DEF : null,

    // equipment
    weapon : null,
    armor : null,

    destroyCreature : function()
    {
        // if the creature is positionned, we free its tile
        if(this.x != null && this.y != null)
        {
            g_level.getTile(this.x, this.y).creature = null;
        }
        
        this.destroyVisualGameObject();
    },
    
    attack : function(victim)
    {
        var damage = this.STR + (this.weapon != null ? this.weapon.PWR : 0);

        victim.takeDamage(damage, this);
    },

    takeDamage : function(damage, attacker)
    {
        this.HP -= damage;

        if(this.type == 'PLAYER')
        {
            updateHP();
            writeMessage(this.getName() + ' lose ' + damage + ' HP');
        }
        else
        {
            writeMessage(this.getName() + ' loses ' + damage + 'HP');
        }

        if(this.HP <= 0)
        {
            this.HP = 0;

            this.die(); 

            if(attacker.type == 'PLAYER')
            {
                attacker.winXP(this.XP);
            }
        }
        // INTELLIGENCE!!!
        else if(this.type != 'PLAYER')
        {
            this.attack(attacker);
        }
    },

    // TODO
    getHealth : function(quantity)
    {
        this.HP += quantity;

        if(this.HP > this.maxHP)
        {
            this.HP = this.maxHP;
        }
    },

    die : function()
    {
        if(this.type == 'PLAYER')
        {
            writeMessage(this.getName() + ' die');
            gameOver();
        }
        else
        {
            writeMessage(this.getName() + ' dies');
            // drop stuff
        }

        this.destroyCreature();
    }
};

extend(Creature, VisualGameObject);
