function FiniteStateMachine(state)
{
   this.state = state; 
}

FiniteStateMachine.prototype =
{
   state : null,

   think : function()
   {
      this.state.update();
   },

   changeState : function(state)
   {
      if(this.state && this.state.exit)
      {
         this.state.exit();
      }
      
      this.state = state;
      
      if(this.state && this.state.enter)
      {
         this.state.enter();
      }
   }
};
