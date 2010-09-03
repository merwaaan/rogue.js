/**
 * This file describes various behaviors usable by the state machines modeling
 * the creatures brains.
 *
 * Each of these is a nested object containing this kind of behavioral mapping :
 *
 * current state :
 * {
 *    0 : {'check' : stimulus function, 'next' : next state },
 *    ...
 * }
 *
 * - 'current state' requires to be a State.
 * 
 * - 'stimulus function' requires to be a string representing the name of a member
 *   function of the creature, without parenthesis or argument.
 *   As the function will be called by eval()uation as a generic stimulus function, it
 *   must return a simple array containing the data that will be transmitted to the next 
 *   state constructor. If the stimulus is not verified, it must return null.
 * 
 * - 'next state' requires to be a State.
 *
 * The principle of this system can be summed up as follows :
 * If in the current state, the stimulus is verified, switch to the next state.
 */

var g_roamerBehavior =
{
   RoamState :
   {
      0 : {'check' : 'seeEnemy', 'next' : FollowState}
   },
   FollowState :
   {
      0 : {'check' : 'nextToTarget', 'next' : AttackState}
   },
   AttackState :
   {
      0 : {'check' : 'farFromTarget', 'next' : FollowState}
   }
};
