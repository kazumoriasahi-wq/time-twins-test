(function(root){'use strict';
const DELAY=3,STEP=.18,keys=[[0,-1],[1,0],[0,1],[-1,0]],names=['はじめての残響','待つことも動き','ふたりの合図','遠回りの記憶','壁の向こうへ','交差する時間','静かな回廊','折り返す足音','ふたつの部屋','追いかける昨日','最後の一歩','時をつなぐ双子'];
function level(i){const gy=[4,2,6,3,5,2,6,4,3,5,2,6][i],ay=[4,3,5,2,6,4,3,5,6,2,4,5][i];let walls=[];for(let y=1;y<8;y++)if(y!==gy)walls.push([5,y]);if(i>=3){const wy=i%2?5:3;for(let x=1;x<=3;x++)if(x!==2)walls.push([x,wy]);}if(i>=6&&gy!==4)walls.push([7,4]);walls=walls.filter(p=>!same(p,[2,ay])&&!same(p,[3,gy]));const b=i<2?null:(i>=8?[6,gy]:[3,gy]);return {id:i,name:names[i],start:[1,4],a:[2,ay],b,gate:[5,gy],goal:[7,gy],walls,hint:i>=8?'金色で3秒待つ。双子に最初の扉を任せ、向こう側の青色へ。ふたりの合図で出口も2.6秒開く。':i<2?'金色のスイッチで3秒待とう。過去の自分が現れたら、扉へ進もう。':'金色で3秒以上待ち、青色へ移動。ふたりが同時に乗ると扉が開く。扉は離れても2.6秒だけ開く。'};}
const same=(a,b)=>!!a&&!!b&&a[0]===b[0]&&a[1]===b[1];
function create(i=0){const l=level(i);return {l,t:0,p:[...l.start],prev:[...l.start],echo:null,history:[{t:0,p:[...l.start]}],cool:0,gateUntil:-1,exitUntil:-1,open:false,won:false,moves:0,pulses:0};}
function floor(l,p){return p[0]>0&&p[0]<8&&p[1]>0&&p[1]<8&&!l.walls.some(w=>same(w,p));}
function pass(s,p,force=false){return floor(s.l,p)&&(!same(p,s.l.gate)||force||s.open||same(s.p,s.l.gate));}
function tick(s,dt,dir=null){if(s.won)return;dt=Math.max(0,Math.min(dt,.05));s.t+=dt;s.cool=Math.max(0,s.cool-dt);if(dir&&s.cool<=.00001){const p=[s.p[0]+dir[0],s.p[1]+dir[1]];if(pass(s,p)){s.prev=[...s.p];s.p=p;s.moves++;s.cool=STEP;s.history.push({t:s.t,p:[...p]});}}
 const target=s.t-DELAY;s.echo=null;if(target>=0){for(let j=s.history.length-1;j>=0;j--)if(s.history[j].t<=target+1e-8){s.echo=[...s.history[j].p];break;}}
 while(s.history.length>1&&s.history[1].t<target-.2)s.history.shift();
 const echoActive=same(s.echo,s.l.a),cooperate=echoActive&&(!s.l.b||same(s.p,s.l.b));if(cooperate)s.exitUntil=s.t+2.6;const active=s.l.id>=8?echoActive:cooperate;if(active){if(!s.open)s.pulses++;s.gateUntil=s.t+2.6;}s.open=s.t<=s.gateUntil||same(s.p,s.l.gate);if(same(s.p,s.l.goal)&&(s.l.id<8||s.t<=s.exitUntil))s.won=true;
}
function path(s,to,force=false){let q=[[s.p]],seen=new Set([s.p.join()]);while(q.length){const route=q.shift(),p=route[route.length-1];if(same(p,to))return route.slice(1);for(const d of keys){const n=[p[0]+d[0],p[1]+d[1]],k=n.join();if(!seen.has(k)&&pass(s,n,force)){seen.add(k);q.push([...route,n]);}}}return [];}
const api={DELAY,STEP,COUNT:names.length,level,create,tick,path,same,floor};if(typeof module==='object')module.exports=api;else root.Twins=api;
})(globalThis);


