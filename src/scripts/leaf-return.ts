import { createLeafFlight } from './leaf-physics.ts';

export type LeafPose = {x:number;y:number;rotation:number;pitch:number;yaw:number;roll:number;scale:number;pivot:number};
export const LEAF_RETURN_SECONDS = 5.6;

/** A finite glide back to the moving scroll trajectory. Both joins have zero
 * added velocity; flutter and torsion use the descent model. */
export function createLeafReturn(from:LeafPose, clock:number, distance:number) {
  const flight=createLeafFlight(), initial=flight(clock);
  const amplitude=Math.min(72,Math.max(0,distance)*.28);
  return (seconds:number,target:LeafPose):LeafPose => {
    const p=Math.max(0,Math.min(1,seconds/LEAF_RETURN_SECONDS));
    if(p===0)return {...from};
    if(p===1)return {...target};
    const blend=p*p*p*(10+p*(-15+6*p));
    const envelope=Math.sin(Math.PI*p)**2;
    const flutter=flight(clock+seconds*.95);
    const pose={...target};
    for(const key of Object.keys(pose) as (keyof LeafPose)[])pose[key]=from[key]+(target[key]-from[key])*blend;
    pose.x+=amplitude*envelope*(flutter.x-initial.x);
    pose.y+=amplitude*.42*envelope*(flutter.vx**2-initial.vx**2);
    const strength=Math.min(1,distance/80)*envelope;
    pose.rotation+=(flutter.bank-initial.bank)*75*strength;
    pose.pitch+=(flutter.twist-initial.twist)*48*strength;
    pose.yaw+=(flutter.vx-initial.vx)*22*strength;
    pose.roll+=(flutter.twist-initial.twist)*100*strength;
    return pose;
  };
}
