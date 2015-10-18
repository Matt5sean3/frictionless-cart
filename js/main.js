"use strict";
var inputpoint=0;
var AJAXvar="";
var ctrls=new Array(4);
var keys=new Array(4);
var message=new Array(4);
message[0]="press the key for up";
message[1]="press the key for down";
message[2]="press the key for left";
message[3]="press the key for right";
var onSurface=true;
var speed = [0, 0, 0];
var force = [0, 0, 0];
var appForce=0;
var xRotSpeed=0;
var sprite=0;
var points=0;
var playing=true;
var count=0;
var mass=10;
var grav=1;
for(var c=0;c<keys.length;c++)keys[c]=false;
//begin 3D engine variables and functions
var dataString="";
var field;
var full=false;
var focalLength=500;
var pi = Math.PI; //pi browser specifically
var cameraX; //01
var cameraY; //23
var cameraZ; //coordinate plane is flipped horizontally out of math class
var losX;
var losY;
var partTwo="";
var d;
var f;
var j=0;
var fighter="-100,-150,100;-100,-120,100;-50,-150,150;-50,-120,150;50,-150,150;50,-120,150;100,-150,100;100,-120,100;-100,-150,-150;-100,-120,-150;100,-150,-150;100,-120,-150@0,1,3,2,0,2,4,5,3,5,7,6,4,6,10,11,7,11,9,8,10,8,0,1,9";
var pixelData;
var planeArr;
var pointArr;
var pointVis;
var surfaceArr;
var surfaceNum;
var planeNum;
var pointNum;
var turn=5;
function point3D(x,y,z){
this.x=x;
this.y=y;
this.z=z;
}

function surface(x,z,y,width,depth,slopex,slopez,id){//p1 is the lesser point, p2 is the greater point
  this.active=true;
  this.slopeX=slopex;
  this.slopeZ=slopez;
  this.width=width;
  this.depth=depth;
  this.point=new Array(4);
  this.point[0]=new point3D(x,y,z);
  this.point[1]=new point3D(x+width,y+width*slopex,z);
  this.point[2]=new point3D(x+width,y+width*slopex+depth*slopez,z+depth);
  this.point[3]=new point3D(x,y+depth*slopez,z+depth);
  this.id=id;
  this.touched=false;
}

function surfaceToPlane(context,a,color,tag){
  a.id=tag;
  var c;
  for(c=0;c<a.point.length;c++){
    pointArr.push(a.point[c]);
    pointVis.push(vertexShader(pointArr[pointNum]));
    pointNum++;
  }
  planeArr.push(new formList(context,color,tag));
  planeArr[planeNum].addPoint(pointNum-1);
  planeArr[planeNum].addPoint(pointNum-2);
  planeArr[planeNum].addPoint(pointNum-3);
  planeArr[planeNum].addPoint(pointNum-4);
  planeArr[planeNum].addPoint(pointNum-1);
  planeNum++;
}

/**
 *  Take a point, a, and places it in the camera frame
 *  Functionally, it's a vertex shader
 */
function vertexShader(a)
{
  // TODO switch over to a camera transform
  // TODO make camera an argument instead of a global variable
  // spatial position of camera
  var cameraPosition = new point3D(cameraX, cameraY, cameraZ);
  // TODO: roll, pitch, yaw of camera
  // looks a bit weird, don't worry about it
  var cameraOrientation = new point3D(-losY * Math.PI / 180, losX * Math.PI / 180, 0);
  var adj = new point3D(0,0,0);
  // Adjustments for translation
  adj.x = a.x - cameraPosition.x;
  adj.y = a.y - cameraPosition.y;
  adj.z = a.z - cameraPosition.z;
  // Adjustments for rotation
  // rotation about the y-axis
  var sinY = Math.sin(cameraOrientation.y);
  var cosY = Math.cos(cameraOrientation.y);
  var x = adj.x, z = adj.z;
  adj.x = cosY * x + sinY * z;
  adj.z = cosY * z - sinY * x;
  // rotation about the x-axis
  var sinX = Math.sin(cameraOrientation.x);
  var cosX = Math.cos(cameraOrientation.x);
  var x = adj.x, y = adj.y;
  adj.x = x * cosX - y * sinX;
  adj.y = x * sinX + y * cosX;
  // perspective adjustments
  if(adj.z == -focalLength)
    adj.z = -focalLength+1;
  if(adj.z < -focalLength) {
    var ratio=focalLength/(adj.z-focalLength);
    adj.x=Math.round(300+(1/ratio)*adj.x);
    adj.y=Math.round(300+(1/ratio)*adj.y);
  }
  else{
    var ratio=focalLength/(adj.z+focalLength);
    adj.x=Math.round(300-ratio*adj.x);
    adj.y=Math.round(300-ratio*adj.y);
  }
  return adj;
}



function surfaceTest(){
  var c;
  var d;
  var f;
  var g;
  var diffx;
  var diffy;
  var diffz;
  var ratio;
  var theta;
  var aboveArr;
  var slopeX;
  var slopeZ;
  var wasOnSurface=onSurface;
  onSurface=false;
  for(c=0;c<surfaceArr.length && onSurface==false;c++){
    if(!surfaceArr[c].active)
      onSurface=false;
    else if(surfaceArr[c].point[0].z<=cameraZ && surfaceArr[c].point[0].z+surfaceArr[c].depth>cameraZ && surfaceArr[c].point[0].x<cameraX && surfaceArr[c].point[0].x+surfaceArr[c].width>cameraX)
      onSurface=true;
    else onSurface=false;
    if(onSurface){
      surfaceArr[c].touched=true;
      var upper=cameraY - 150;
      var lower=cameraY - 150 + speed[1];
      var offsetX=cameraX-surfaceArr[c].point[0].x;
      var offsetZ=cameraZ-surfaceArr[c].point[0].z;
      
      slopeX=surfaceArr[c].slopeX;
      slopeZ=surfaceArr[c].slopeZ;
      var ySet=surfaceArr[c].point[0].y+offsetX*slopeX+offsetZ*slopeZ;
      
      if((upper>=ySet || wasOnSurface) && lower<=ySet) {
        onSurface=true;
        translate(planeArr[sprite],0,ySet-cameraY+150,0);
        cameraY=ySet+150;
        force[1] += mass * grav;
        force[0] -= mass * grav * Math.cos(Math.atan(slopeX)) * Math.sin(Math.atan(slopeX));
        force[2] -= mass * grav * Math.cos(Math.atan(slopeZ)) * Math.sin(Math.atan(slopeZ));
        force[0] += appForce * Math.sin(losX*pi/180);
        force[2] += appForce * Math.cos(losX*pi/180);
        if(!wasOnSurface){
          speed[1] = 0;
        }
      } else 
        onSurface=false;
    }
  }
  return 0;
}

function formList(context,color,tag){
  this.hidden=false;
  this.context=context;
  this.color=color;
  this.tag=tag;
  this.points=new Array(0);
  this.pLength=0;
  this.addPoint=function(a) {
    this.points.push(a);
    this.pLength++;
  }
}

function translate(a,x,y,z){
  for(var c = 0;c < a.pLength; c++) {
    var f = false;
    for(var d = 0;d<c && !f; d++)
      f = (a.points[d] == a.points[c]);
    if(!f){
      pointArr[a.points[c]].x += x;
      pointArr[a.points[c]].y += y;
      pointArr[a.points[c]].z += z;
    }
  }
}

function rotate(a,thx,thy,thz,x,y,z){//th operator is an angle the object is rotated by
  var c;
  var d;
  var f;
  var adj=new point3D(0,0,0);
  var radius;
  var angle;
  for(c=0;c<a.pLength;c++){
    f=false;
    for(d=0;d<c && !f;d++)f=(a.points[d]==a.points[c]);
    if(!f){
      adj.x=pointArr[a.points[c]].x-x;
      adj.y=pointArr[a.points[c]].y-y;
      adj.z=pointArr[a.points[c]].z-z;
      radius=Math.sqrt(adj.x*adj.x+adj.z*adj.z);//x-axis
      if(adj.z==0)adj.z=1;
      angle=Math.atan(adj.x/adj.z)+thx*pi/180;
      if(adj.z>0){
        adj.z=radius*Math.cos(angle);
        adj.x=radius*Math.sin(angle);
      }else{
        adj.z=-radius*Math.cos(angle);
        adj.x=-radius*Math.sin(angle);
      }
      radius=Math.sqrt(adj.y*adj.y+adj.z*adj.z);//y-axis
      if(adj.z==0)adj.z=1;
      angle=Math.atan(adj.y/adj.z)+thy*pi/180;
      if(adj.z<0){
        adj.y=-radius*Math.sin(angle);
        adj.z=-radius*Math.cos(angle);
      }else{
        adj.y=radius*Math.sin(angle);
        adj.z=radius*Math.cos(angle);
      }
      radius=Math.sqrt(adj.y*adj.y+adj.x*adj.x);//z-axis
      if(adj.y==0)adj.y=1;
      angle=Math.atan(adj.x/adj.y)+thz*pi/180;
      if(adj.y<0){
        adj.y=-radius*Math.cos(angle);
        adj.x=-radius*Math.sin(angle);
      }else{
        adj.y=radius*Math.cos(angle);
        adj.x=radius*Math.sin(angle);
      }
      pointArr[a.points[c]].x=x+adj.x;
      pointArr[a.points[c]].y=y+adj.y;
      pointArr[a.points[c]].z=z+adj.z;
    }
  }
}


function transformSurface(a,x,y,z){
  a.xa+=x;
  a.xb+=x;
  a.za+=z;
  a.zb+=z;
  a.y+=y;
  return a;
}

//end 3D engine functions
var osize=0;
var xpos=0;
var ypos=0;
var loc=1;
var chardata;
var otherdata;

function drawSprite(str,color,tag,focus){
planeArr.push(new formList(field,color,tag));
var parts=str.split("@");
var points=parts[0].split(";");
var path=parts[1].split(",");
var c;
var d;
for(c=0;c<points.length;c++){
d=points[c].split(",");
pointArr.push(new point3D(focus.x+parseInt(d[0]),focus.y+parseInt(d[1]),focus.z+parseInt(d[2])));
}
pointNum+=points.length;
for(c=0;c<path.length;c++)planeArr[planeNum].addPoint(pointNum-points.length+parseInt(path[c]));
}

function setup(){
if(playing==true)window.scrollBy(0,250)

planeArr=new Array(0);
pointArr=new Array(0);
pointVis=new Array(0);
surfaceArr=new Array(0);
surfaceNum=0;
planeNum=0;
pointNum=0;

playing=true;
count=0;
cameraX = 410;
cameraY = 500;
cameraZ = 400;
losX=0;
losY=5;
inputpoint=0;
if(!field)field=document.getElementById("space").getContext("2d");
field.globalCompositeOperation="source-over";
field.clearRect(0,0,600,600);
field.font="20px Arial";
field.fillStyle="#FFFFFF";
field.fillText("press the key for up",200,200);
document.onkeydown=function(e){
var cx=(window.event)?event.keyCode:e.keyCode;
if(inputpoint<ctrls.length){
field.clearRect(200,100,300,300);
if(inputpoint+1<ctrls.length)field.fillText(message[inputpoint+1],200,200);
else{
field.fillText("READY!!!",200,200);
field.font="14px Arial";
field.fillText("press any key",200,230);
}
ctrls[inputpoint]=cx;
inputpoint++;
}else{
init();
}
}
//other setup actions
}

function init3D(){
document.onkeydown=function(e){
var cx=(window.event)?event.keyCode:e.keyCode;
var c=0;
while(c<ctrls.length && ctrls[c]!=cx)c++;
if(c<keys.length)keys[c]=true;
}
document.onkeyup=function(e){
var cx=(window.event)?event.keyCode:e.keyCode;
var c=0;
while(c<ctrls.length && ctrls[c]!=cx)c++;
if(c<keys.length)keys[c]=false;
}
var d;
var c;
for(c=0;c<9;c++){
surfaceArr.push(new surface(0,c*500,0,500,500,0,0,"xxx"));
surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
surfaceNum++;

surfaceArr.push(new surface(5000,c*500,0,500,500,0,0,"xxx"));
surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
surfaceNum++;
}
for(d=0;d<11;d++){
surfaceArr.push(new surface(d*500,-500,0,500,500,0,0,"xxx"));
surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
surfaceNum++;
surfaceArr.push(new surface(d*500,c*500,0,500,500,0,0,"xxx"));
surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
surfaceNum++;
}

drawSprite(fighter,"#FFFFFF","player",new point3D(cameraX,cameraY,cameraZ));
sprite=planeNum;
planeNum++;
recursive3D();
}

var init = init3D;

function gameOver(a){
  playing=false;
}

function recursive3D(){
  var acc = [0, 0, 0];
  field.clearRect(0,0,600,600);
  field.font = "14px Times New Roman";   
  field.fillStyle = "#FFFFFF";   
  field.fillText("speed"+Math.round(Math.sqrt(speed[0] * speed[0] + speed[1] * speed[1] + speed[2] * speed[2])),400,120);
  force = [0, 0, 0];
  field.fillText("time:"+(count/20),400,100);
  var gx=true;
  for(c=0;c<surfaceNum;c++)gx+=surfaceArr[c].touched;
  field.fillText("Progress:%"+(gx/surfaceNum)*100,400,140);
  if(gx>=surfaceNum)playing=false;
  if(cameraY<-1000)playing=false;
  if(playing)
    setTimeout("recursive3D();",50);
  else {
    field.font = "40px Times New Roman";   
    field.fillStyle = "#FFFFFF";   
    if(gx>=surfaceNum)field.fillText("COMPLETE!!!", 50, 300);
    else field.fillText("Game Over", 50, 300);
    setTimeout("setup();",8000);
    return 0;
  }
  count++;
  if(keys[0])
    appForce = 5;
  if(keys[1])
    appForce = -5;
  if(!(keys[0] || keys[1]))
    appForce=0;
  if(keys[2])
    xRotSpeed=-turn;//turn left
  if(keys[3])
    xRotSpeed=turn;//turn right
  if(!(keys[2] || keys[3]))
    xRotSpeed=0;
  force[1] -= mass * grav;
  
  surfaceTest();//checks for normal force
  acc[0] = force[0] / mass;
  acc[1] = force[1] / mass;
  acc[2] = force[2] / mass;
  
  cameraX -= speed[0]+(acc[0]/2);
  cameraY += speed[1]+(acc[1]/2);
  cameraZ += speed[2]+(acc[2]/2);
  
  speed[0] += acc[0];
  speed[1] += acc[1];
  speed[2] += acc[2];
  
  translate(planeArr[sprite],-speed[0],speed[1],speed[2]);
  rotate(planeArr[sprite], -xRotSpeed, 0, 0, cameraX, cameraY - 75, cameraZ);
  
  losX+=xRotSpeed;
  
  var c;
  var d;
  var i;
  var j;
  var mod;
  var tst;
  var tft;
  dataString="";
  // apply the vertex shader
  for(c=0; c < pointNum;c++)
    pointVis[c] = vertexShader(pointArr[c]);
  
  for(c=0; c < planeNum; c++) {
    mod=planeArr[c].points.length;
    var k = false;
    var spacein=false;
    for(var i=0;i<mod && spacein==false;i++)
      spacein=(pointVis[planeArr[c].points[i]].x>=0 && pointVis[planeArr[c].points[i]].x<=600 && pointVis[planeArr[c].points[i]].y>=0 && pointVis[planeArr[c].points[i]].y<=600 && pointVis[planeArr[c].points[i]].z>0);
    if(spacein && !planeArr[c].hidden) {
      field.strokeStyle=planeArr[c].color;
      field.beginPath();
      field.moveTo(Math.round(pointVis[planeArr[c].points[0]].x),Math.round(pointVis[planeArr[c].points[0]].y));
      for(j=1;j<mod;j++) {
        field.lineTo(Math.round(pointVis[planeArr[c].points[j]].x),Math.round(pointVis[planeArr[c].points[j]].y));
      }
      field.stroke();
    }
  }
  return 0;
}
